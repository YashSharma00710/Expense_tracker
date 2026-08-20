import mongoose from "mongoose";

// const date = new Date().toLocaleDateString()
const expenseSchema = new mongoose.Schema({
    category: { type: String, min: 3, max: 10 },
    note: { type: String, min: 3, max: 20 },
    amount: { type: Number, min: 1 },
    date: { type: Date, default: Date.now}
});
export const Expense = mongoose.models.Expense || mongoose.model('Expense', expenseSchema);