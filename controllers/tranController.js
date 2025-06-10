import { Transaction } from "../models/tranModel.js";
import { sendCookie } from "../utils/features.js";
import ErrorHandler from "../middlewares/error.js";
import nodemailer from "nodemailer";

export const twithdraw = async (req, res, next) => {
  try {
    const { amount } = req.body;

    await Transaction.create({
      amount,
      balance: req.user.balance,
      isCredited: false,
      user: req.user,
    });

    res.status(201).json({
      success: true,
      message: "(B)Withdraw transaction Added!",
    });
  } catch (err) {
    next(err);
  }
};

export const tcredit = async (req, res, next) => {
  try {
    const { amount } = req.body;

    await Transaction.create({
      amount,
      balance: req.user.balance,
      isCredited: true,
      user: req.user,
    });

    res.status(201).json({
      success: true,
      message: "(B)Credit Transaction Added!",
    });
  } catch (err) {
    next(err);
  }
};

export const threehistory = async (req, res, next) => {
  try {
    const userid = req.user._id;

    const threedata = await Transaction.find({ user: userid })
      .sort({ createdAt: -1 }) // Get latest transactions
      .limit(3);

    res.status(200).json({
      success: true,
      threedata,
    });
  } catch (err) {
    next(err);
  }
};

export const fullhistory = async (req, res, next) => {
  try {
    const userid = req.user._id;
    const userEmail = req.body.email;

    const fulldata = await Transaction.find({ user: userid }).sort({
      createdAt: -1,
    });

    if (!fulldata.length) {
      return res
        .status(404)
        .json({ success: false, message: "No transactions found." });
    }

        // Convert transactions to HTML table
    const htmlTable = `
      <h2>Account Statement</h2>
      <table border="1" cellspacing="0" cellpadding="8">
        <thead>
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>Amount</th>
            <th>Balance</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          ${fulldata
            .map(tx => {
              const date = new Date(tx.createdAt);
              return `
                <tr>
                  <td>${date.toLocaleDateString()}</td>
                  <td>${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                  <td>${tx.amount}</td>
                  <td>${tx.balance}</td>
                  <td>${tx.isCredited ? "Deposit" : "Withdraw"}</td>
                </tr>
              `;
            })
            .join("")}
        </tbody>
      </table>
    `;

    //send Email
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        },
    });

    const mailOptions = {
        from : process.env.MAIL_USER,
        to: userEmail,
        subject: "Your Full Bank Statement",
        html: htmlTable,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: "Email Sent Successfully"
    });
  } catch (err) {
    next(err);
  }
};
