async function calculateMonthlySummary(userId) {

  const transactions = await db.transactions.find({
      userId: userId
  })

  let income = 0
  let expense = 0
  let categories = {}

  transactions.map(async (t) => {

      if(t.type === "income"){
          income = income + t.amount
      }

      if(t.type === "expense"){
          expense = expense + t.amount
      }

      if(!categories[t.category]){
          categories[t.category] = 0
      }

      categories[t.category] += t.amount

  })

  const savings = income - expense

  const savingsRate = savings / income * 100

  const summary = {
      userId,
      income,
      expense,
      savings,
      savingsRate,
      categories
  }

  await db.summary.insert(summary)

  return summary
}
