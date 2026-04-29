type Expense = {
  id: string
  amount: number
  category: string
  description: string
  date: string
}

export default function ExpenseTable({ expenses }: { expenses: Expense[] }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-6 shadow-soft">
      <h2 className="text-lg font-semibold text-primary">Expense List</h2>
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="text-left text-xs uppercase text-secondary">
            <tr className="border-b border-border">
              <th className="py-3 pr-4">Date</th>
              <th className="py-3 pr-4">Category</th>
              <th className="py-3 pr-4">Description</th>
              <th className="py-3 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.id} className="border-b border-border">
                <td className="py-3 pr-4">
                  {new Date(expense.date).toLocaleDateString()}
                </td>
                <td className="py-3 pr-4">{expense.category}</td>
                <td className="py-3 pr-4">{expense.description}</td>
                <td className="py-3 text-right font-medium text-primary">
                  ₹{Number(expense.amount).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
