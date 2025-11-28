
import numpy as np

def calc_re(rf, beta, market_return):
    return rf + beta * (market_return - rf)

def calc_rd(interest_expense, total_debt):
    return interest_expense / total_debt

def levered_wacc(Re, Rd, tax_rate, equity_value, debt_value):
    V = equity_value + debt_value
    E = equity_value / V
    D = debt_value / V
    return E * Re + D * Rd * (1 - tax_rate)

def unlevered_cost_equity(Re, debt_value, equity_value, tax_rate):
    return Re / (1 + (1 - tax_rate) * (debt_value / equity_value))

def unlevered_wacc(Ru, Rd, equity_value, debt_value):
    V = equity_value + debt_value
    E = equity_value / V
    D = debt_value / V
    return E * Ru + D * Rd

def annualize_monthly_return(rm):
    return (1 + rm)**12 - 1

rf = 0.03
beta = 1.2
market_return = 0.09
interest_expense = 20000
total_debt = 400000
equity_value = 1000000
debt_value = 400000
tax_rate = 0.21
monthly_return = 0.015

Re = calc_re(rf, beta, market_return)
Rd = calc_rd(interest_expense, total_debt)
WACC_levered = levered_wacc(Re, Rd, tax_rate, equity_value, debt_value)
Ru = unlevered_cost_equity(Re, debt_value, equity_value, tax_rate)
WACC_unlevered = unlevered_wacc(Ru, Rd, equity_value, debt_value)
annualized = annualize_monthly_return(monthly_return)

print(Re)
print(Rd)
print(WACC_levered)
print(Ru)
print(WACC_unlevered)
print(annualized)


