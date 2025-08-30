import { useDispatch, useSelector } from "react-redux";
import { deleteExpense } from "../store/expenseSlice";

export default function ExpenseList() {
  const { list } = useSelector((state) => state.expenses);
  const dispatch = useDispatch();

  return (
    <table className="w-full border-collapse">
     <thead>
       <tr className="bg-gray-100">
         <th className="p-3 text-left">Description</th>
         <th className="p-3 text-left">Amount</th>
         <th className="p-3 text-left">Category</th>
         <th className="p-3 text-left">Date</th>
         <th className="p-3 text-left">Action</th>
       </tr>
     </thead>
     <tbody>
       {list.map((exp) => (
         <tr key={exp.id} className="border-b hover:bg-gray-50">
           <td className="p-3">{exp.description}</td>
           <td className="p-3">${exp.amount}</td>
           <td className="p-3">{exp.category}</td>
           <td className="p-3">{exp.date}</td>
           <td className="p-3">
             <button
               onClick={() => dispatch(deleteExpense(exp.id))}
               className="text-red-600 hover:underline"
             >
               Delete
             </button>
           </td>
         </tr>
       ))}
     </tbody>
   </table>
  );
}
