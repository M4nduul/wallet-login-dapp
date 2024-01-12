import { recoverPersonalSignature } from "eth-sig-util";
import { bufferToHex } from "ethereumjs-util";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { config } from "../../config";
import { User } from "../../models/user.model";

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { signature, publicAddress } = req.body;
    if (!signature || !publicAddress) {
      return res
        .status(400)
        .send({ message: "signature and publicAddress are required" });
    }

    // Get the user with the given publicAddress
    let user = await User.findOne({ where: { publicAddress } });
    if (!user) {
      // If the user doesn't exist, create a new user
      user = new User();
      user.nonce = Math.floor(Math.random() * 10000);
      await user.save();
    }

    // If the user exists then verify the user signature
    const msg = `nonce: ${user.nonce}`;
    const msgBufferHex = bufferToHex(Buffer.from(msg, "utf8"));
    const address = recoverPersonalSignature({
      data: msgBufferHex,
      sig: signature,
    });

    // Match the stored address with the address found after verifying the signature
    if (address.toLowerCase() === publicAddress.toLowerCase()) {
      // Create a JWT token
      const token = jwt.sign(
        {
          payload: {
            id: user.id,
            publicAddress,
          },
        },
        config.secret,
        {
          algorithm: config.algorithms[0],
        }
      );
      return res.json({ accessToken: token, userId: user.id });
    } else {
      res.status(401).send({
        error: "Signature verification failed",
      });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};
