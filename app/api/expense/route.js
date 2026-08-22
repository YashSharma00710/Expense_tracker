"use server"
import connetDB from '@/db/connectDB'
import React from 'react'
import { Expense } from '@/model/Expense.js'
import { NextResponse } from 'next/server'

export const POST = async (req) => {
    await connetDB()
    const data = await req.json();

    console.log("data:", data)
    await Expense.create(data)
    // let data = await Expense.create(req.json)
    return NextResponse.text("received");
}
