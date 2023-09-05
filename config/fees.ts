import { Fees } from "./types"
import { FeeTypes } from "../utils"

export const fees: Fees = {
  [FeeTypes.Default]: {
    payoutAddress: "",
    bps: 0,
  },
  [FeeTypes.Harvest]: {
    payoutAddress: "",
    bps: 0,
  },
  [FeeTypes.Deposit]: {
    payoutAddress: "",
    bps: 0,
  },
  [FeeTypes.DepositCharity]: {
    payoutAddress: "",
    bps: 0,
  },
  [FeeTypes.Withdraw]: {
    payoutAddress: "",
    bps: 0,
  },
  [FeeTypes.WithdrawCharity]: {
    payoutAddress: "",
    bps: 0,
  },
  [FeeTypes.EarlyLockedWithdraw]: {
    payoutAddress: "",
    bps: 0,
  },
  [FeeTypes.EarlyLockedWithdrawCharity]: {
    payoutAddress: "",
    bps: 1000,
  },
}
