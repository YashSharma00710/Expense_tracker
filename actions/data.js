"use server"
import connetDB from "@/db/connectDB"
import { Expense } from "@/model/Expense"
import { connect } from "mongoose"

export const Data = async () => {
    await connetDB()
    let list = await Expense.find().sort({ date: -1 })
    return JSON.parse(JSON.stringify(list));
}

export const Category = async () => {
    await connetDB();
    let data = await Expense.find({}, { category: 1 })
    // console.log(data)
    let newobj = []
    let newarr = data.filter((i) => {
        if (!(newobj.includes(i.category))) {
            newobj.push(i.category)
            return i
        }
    })
    // console.log(newarr)
    return JSON.parse(JSON.stringify(newarr));
}
