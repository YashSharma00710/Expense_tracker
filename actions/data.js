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
    // let data = await Expense.find({}, { category: 1 })
    // console.log(data)
    let newobj = []
    // let newarr = data.filter((i) => {
    //     if (!(newobj.includes(i.category))) {
    //         newobj.push(i.category)
    //         return i
    //     }
    // })
    let data = await Expense.aggregate([
        {
            $group: {
                _id: null,
                data: {
                    $addToSet: "$category"
                }
            }
        },
        {
            $project: {
                _id: 0,
                data: 1
            }
        }
    ])
    // console.log(data[0].data)
    let uniqueData=data[0].data
    return uniqueData;
}
