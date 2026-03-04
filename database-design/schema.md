**Users**
users
id (PK)
name
email (unique)
password_hash
created_at
**Transactions**
transactions
id (PK)
user_id (FK)
type (income / expense)
category
amount
currency
date
description
created_at
**Goals**
goals
id (PK)
user_id (FK)
goal_name
target_amount
current_amount
target_date
created_at
**Financial Health Scores**
financial_health_scores
id (PK)
user_id (FK)
score
category
calculated_at
