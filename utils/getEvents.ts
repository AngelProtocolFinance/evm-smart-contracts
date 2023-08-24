// Copied from https://github.com/dethcrypto/TypeChain/issues/736#issuecomment-1175642251

import {BaseContract, Event} from "ethers";
import {TypedEvent, TypedEventFilter} from "typechain-types/common";

/**
 * Finds the events that match the specified filter, and
 * returns these parsed and mapped to the appropriate type
 */
export function getEvents<TArgsArray extends any[], TArgsObject>(
  events: Event[] = [],
  contract: BaseContract,
  eventFilter: TypedEventFilter<TypedEvent<TArgsArray, TArgsObject>>
): TypedEvent<TArgsArray, TArgsObject>[] {
  return events
    .filter((ev) => matchTopics(eventFilter.topics, ev.topics))
    .map((ev) => {
      const args = contract.interface.parseLog(ev).args;
      const result: TypedEvent<TArgsArray, TArgsObject> = {
        ...ev,
        args: args as TArgsArray & TArgsObject,
      };
      return result;
    });
}

function matchTopics(
  filter: Array<string | Array<string>> | undefined,
  value: Array<string>
): boolean {
  // Implement the logic for topic filtering as described here:
  // https://docs.ethers.io/v5/concepts/events/#events--filters
  if (!filter) {
    return false;
  }
  for (let i = 0; i < filter.length; i++) {
    const f = filter[i];
    const v = value[i];
    if (typeof f == "string") {
      if (f !== v) {
        return false;
      }
    } else {
      if (f.indexOf(v) === -1) {
        return false;
      }
    }
  }
  return true;
}
