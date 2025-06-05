import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";
import { sendCookie } from "../utils/features.js";
import ErrorHandler from "../middlewares/error.js";
import crypto from 'crypto';


export const login = async (req, res, next) => {  
    try{
        const { atmNumber, pin } = req.body; 

        const user = await User.findOne({ atmNumber });
        if(!user) return next (new ErrorHandler("Invalid ATM Number or PIN", 400));

        if(user.pin !== pin){
            return next (new ErrorHandler("Invalid ATM Number or PIN", 400));
        }

        sendCookie(user, res, `Welcome back ${user.name}`, 200);
    }catch(error){
        next(error);
    }
}


//Generating random number
function generateRandom16DigitNumber() {
  const min = BigInt('1000000000000000'); // Smallest 16-digit number
  const max = BigInt('9999999999999999'); // Largest 16-digit number

  // Generate a random 8-byte (64-bit) integer
  let randomBytes = crypto.randomBytes(8);
  let randomNumber = BigInt('0x' + randomBytes.toString('hex'));

  // Scale to the range of 16-digit numbers
  let range = max - min + 1n;
  let result = (randomNumber % range) + min;

  return result.toString();
}


export const register = async (req, res, next) => {
    try{
        const { name, pin } = req.body;

        let randomNumber;
        let user2;

        do {
            randomNumber = generateRandom16DigitNumber();
            user2 = await User.findOne({ atmNumber: randomNumber });
        } while (user2);

        let user = await User.create({ name, pin, atmNumber : randomNumber});
        sendCookie(user, res, "Registered Successfully", 201);
    }catch(error){
        next(error);
    }
}


export const deposit = async (req, res, next) => {
    try{
        const { amount } = req.body;
        const user = req.user;

        user.balance = user.balance + amount;
        await user.save();

        res.status(200).json({
            success: true,
            message: `${amount} Rs. deposited Successfully`
        })
    }catch(error){
        next(error);
    }
}

export const withdraw = async (req, res, next) => {
    try{
        const { amount } = req.body;
        const user = req.user;
    
        if(amount > user.balance){
            return next(new ErrorHandler("Entered amount is more than the balance", 400));
        }

        user.balance = user.balance - amount;
        await user.save();

        res.status(200).json({
            success: true,
            message: `${amount} Rs. Withdrawn Successfully`
        })
    }catch(error){
        next(error);
    }
}

export const changePIN = async (req, res, next) => {
    try{
        const { newPin } = req.body;
        const user = req.user;

        user.pin = newPin;
        await user.save();

        res.status(200).json({
            success: true,
            message: "PIN changed successfully"
        })
    }catch(error){
        next(error);
    }

}

export const checkBalance = (req, res) => {

    res.status(200).json({
        success: true,
        balance: req.user.balance,
    })
}

export const getATMNumber = (req, res) => {

    res.status(200).json({
        success: true,
        atmNumber : req.user.atmNumber,
    })
}


//Verify PIN endpoint
export const verifyPin = async (req, res, next) => {    
    try{
        const { enteredPin } = req.body;
        const user = req.user;
        
        if(user.pin !== Number(enteredPin)){
            return next(new ErrorHandler("Entered PIN is incorrect", 400));
        }

        res.status(200).json({
            success: true,
            message: "PIN Verified!",
        })
    }catch(error){
        next(error);
    }
}



