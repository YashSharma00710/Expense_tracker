"use client"
import { useEffect, useState } from "react";
import { toast, ToastContainer, Bounce } from "react-toastify";
import { Data } from "@/actions/data";
import { Category } from "@/actions/data";

export default function Home() {
  const [dropdownlist, setdropdownlist] = useState(false)
  const [showwindow, setshowwindow] = useState(false)
  const [expense, setexpense] = useState([])
  const [total, settotal] = useState(0)
  const [monthcal, setmonthcal] = useState(0)
  const [mostcategory, setmostcategory] = useState('')
  const [cateExpenses, setcateExpenses] = useState(0)
  const [category, setcategory] = useState([])

  const handledropdown = () => {
    let check = !dropdownlist
    setdropdownlist(check)
  }
  const setpopwindow = () => {
    let set = !showwindow
    setshowwindow(set)
  }
  const [form, setform] = useState({ category: "", note: "", amount: "" })


  const handlechange = (e) => {
    setform({ ...form, [e.target.name]: e.target.value.toLowerCase() })
  }


  const sendData = async () => {
    console.log(form)
    console.log("clicked the submit btn")
    if (form?.category && form?.note && form?.amount) {
      let response = await fetch("api/expense", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await response.text()
      console.log("the server message:", data)
      setform({ category: "", note: "", amount: "" })
      setpopwindow(false)
      getexpenses()
    }
    else {
      toast.warn('Fill the fields!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
  }


  const month = new Date().getMonth()

  const getexpenses = async () => {
    console.log("1. getexpenses started")

    let data = await Data()

    console.log("2. Data received:", data)

    setexpense(data)

    console.log("3. setexpense called")
  }

  useEffect(() => {
    getexpenses()
  }, [])

  useEffect(() => {
    console.log("4. expense changed:", expense)
    let total = expense.reduce((acc, curr) => acc + Number(curr.amount), 0)
    settotal(total)


    let currmonth = expense.reduce((acc, curr) => {
      if (month == new Date(curr.date).getMonth()) {
        return acc + curr.amount
      }
      return acc;
    }, 0)
    setmonthcal(currmonth)


    let categoryobj = expense.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + 1
      console.log("acc is ", acc)
      return acc;
    }, {})

    // console.log("categoryobj", categoryobj)
    let sortedcategory = Object.entries(categoryobj)
    let HighestCategory;
    if (sortedcategory.length < 2) {
      HighestCategory = sortedcategory[0]?.[0]
      setmostcategory(sortedcategory[0]?.[0])
    }
    else {
      let most = sortedcategory.sort((a, b) => b[1] - a[1])
      HighestCategory = most[0]?.[0]
      setmostcategory(most[0]?.[0])
    }


    let totalCategory = expense.filter((i) => i.category == HighestCategory)
    let catetotal = totalCategory.reduce((acc, curr) => acc + Number(curr.amount), 0)
    setcateExpenses(catetotal)

    const callingcate = async () => {
      let newdata = await Category()
      // console.log(newdata)
      console.log(newdata)
      setcategory(newdata)
    }
    callingcate()
  }, [expense])

  const ShowCategories = (e) => {
    const list = async () => {
      let data = await Data()
      let newdata = data.filter((i) => {
        // console.log(e.target.innerText)
        return i.category == e.target.innerText
      })
      setexpense(newdata)
    }
    list()
  }
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
      <div className="min-h-screen bg-[#1F1A47]">
        <div className="title relative mx-auto bg-[#2c204e] w-[70%] min-h-[85vh] my-10 p-10 flex flex-col rounded-2xl gap-3 max-[630px]:w-[90%] max-[630px]:p-4">
          <div className="w-full flex justify-between max-[830]:flex-col max-[830px]:items-center">
            <span className="text-3xl font-extrabold max-[630px]:text-xl">
              Expense Tracker
            </span>
            <span>
              <button className="text-[17px] max-[630px]:text-[14px] border py-2 px-7 max-[430px]:py-1 max-[430px]:px-4 rounded-xl font-bold flex justify-center cursor-pointer items-center gap-2" onClick={setpopwindow}>
                <span>
                  <img src="/plus.png" alt="add" draggable={false} className="size-4 invert" />
                </span>
                Add Expense
              </button>
            </span>
          </div>
          {showwindow ?
            <div className="absolute z-10 flex flex-col gap-6 py-6 items-center bg-[#1d0d35] rounded-xl left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-[80%]">
              <div className="flex justify-between w-full px-10">
                <h1 className="text-3xl font-extrabold">Add expense</h1>
                <button onClick={setpopwindow}><img src="/plus.png" alt="" className="size-7 invert rotate-45" /></button>
              </div>
              <div className="flex flex-col gap-4 w-3/4">
                <div className="flex flex-col">
                  <span className="text-xl font-bold">Category</span>
                  <input type="text" placeholder="Enter the category" id="category" value={form.category} name="category" className=" w-full rounded-xl border border-white/70 bg-[#1C0D30] px-3 py-2 text-white placeholder:text-gray-400 outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400" onChange={handlechange} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold">Note</span>
                  <input type="text" placeholder="Enter the Note" id="note" value={form.note} name="note" className=" w-full rounded-xl border border-white/70 bg-[#1C0D30] px-3 py-2 text-white placeholder:text-gray-400 outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400" onChange={handlechange} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold">Amount</span>
                  <input type="number" placeholder="Enter the amount" id="amount" value={form.amount} name="amount" className=" w-full rounded-xl border border-white/70 bg-[#1C0D30] px-3 py-2 text-white placeholder:text-gray-400 outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400" onChange={handlechange} />
                </div>
                <div>
                  <button type="button" className="text-white bg-linear-to-br from-purple-600 to-blue-500 hover:bg-linear-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-base text-sm px-4 py-2.5 text-center leading-5 w-full rounded-xl cursor-pointer" onClick={sendData}>Submit</button>
                </div>
              </div>
            </div>
            : ""}
          <div className="track w-full flex justify-around p-4 max-[430px]:p-2">
            <div className="flex flex-col justify-center font-bold">
              <span className="text-sm text-[#ffffffb2] max-[300px]:text-[12px]">Total spent</span>
              <span className="text-xl max-[430px]:text-[15px]">₹{total}</span>
            </div>
            <div className="flex flex-col justify-center font-bold">
              <span className="text-sm text-[#ffffffb2] max-[300px]:text-[12px]">This Month</span>
              <span className="text-xl text-red-400 max-[430px]:text-[15px]">₹{monthcal}</span>
            </div>
            <div className="flex flex-col justify-center font-bold">
              <span className="text-sm text-[#ffffffb2] max-[300px]:text-[12px]">{mostcategory}</span>
              <span className="text-xl max-[430px]:text-[15px]">₹{cateExpenses}</span>
            </div>
          </div>
          <div className="list bg-[#332756] rounded-2xl max-[430px]:text-[12px] p-5 max-[430px]:p-2 flex flex-col gap-5 min-h-95 max-h-95 overflow-auto">
            <div className="flex justify-between">
              <span>
                Recent Transactions
              </span>
              <span className="relative max-[430px]:text-[12px]" tabIndex={0} onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget)) {
                  setdropdownlist(false);
                }
              }}>
                <button className="flex items-center cursor-pointer" onClick={handledropdown} >
                  <span>Select categories</span>
                  <img src="/down.png" alt="" className="size-5 invert" />
                </button>
                {dropdownlist ?
                  <div className={`flex flex-col bg-slate-700 absolute w-full rounded-sm`}>
                    <button className="border-b cursor-pointer text-start px-2" onClick={getexpenses}>
                      All categories
                    </button>
                    {category.map((i, indx) => (
                      <button key={indx} className="border-b cursor-pointer text-start px-2" onClick={ShowCategories}>
                        {i}
                      </button>
                    ))}
                  </div> : ""}
              </span>
            </div>
            {expense.length === 0 ? (
              <div className="spinner size-10 bg-white self-center rounded-full flex animate-spin justify-center">
                <span className="bg-[#332756] w-8 h-8 rounded-full absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2"></span>
                <span className="w-3 h-2 bg-[#332756] self-start"></span>
              </div>
            ) : (
              expense?.map((i) => {
                return (
                  <div key={i._id} className="listitems  flex justify-between px-7 max-[430px]:px-2 items-center border-b py-3">
                    <div className="flex gap-3 items-center">
                      <span><img src="/budget.png" alt="cart" className="size-6 invert" /></span>
                      <div className="flex flex-col">
                        <span className="font-bold">{i.note}</span>
                        <span className="text-sm max-[430px]:text-[12px]">{i.category} . {new Date(i.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div>
                      <span className="font-bold">
                        -₹{i.amount}
                      </span>
                    </div>
                  </div>
                )
              })
            )
            }
          </div>
        </div>
      </div>
    </>
  );
}
