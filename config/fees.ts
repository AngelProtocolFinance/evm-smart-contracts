import {FeeTypes} from "../types";
import {Fees} from "./types";

export const FEES: Fees = {
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
  [FeeTypes.Balance]: {
    payoutAddress: "",
    bps: 0,
  },
  [FeeTypes.BalanceCharity]: {
    payoutAddress: "",
    bps: 0,
  },
};
