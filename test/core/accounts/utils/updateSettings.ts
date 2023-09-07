import {BigNumberish} from "ethers";
import {wait} from "test/utils";
import {
  AccountStorage,
  LibAccounts,
  TestFacetProxyContract,
} from "typechain-types/contracts/test/accounts/TestFacetProxyContract";
import {DeepPartial} from "types";

/**
 * Updates endowment's setting's permissions field in a way that has no side-effects
 * @param endowId ID of the endowment
 * @param field settings field to update
 * @param settings new settings to set for the setting field
 * @returns the updated endowment
 */
export async function updateSettings(
  endowId: BigNumberish,
  field: keyof LibAccounts.SettingsControllerStruct,
  settings: DeepPartial<LibAccounts.SettingsPermissionStruct>,
  state: TestFacetProxyContract
) {
  const oldEndow = await state.getEndowmentDetails(endowId);

  const lockedEndow: AccountStorage.EndowmentStruct = {
    ...oldEndow,
    settingsController: {
      ...oldEndow.settingsController,
      [field]: getUpdated(oldEndow.settingsController[field], settings),
    },
  };

  await wait(state.setEndowmentDetails(endowId, lockedEndow));
  return lockedEndow;
}

/**
 * Updates all endowment's settings in a way that has no side-effects
 * @param endowId ID of the endowment
 * @param settings new settings to set for all setting fields
 * @returns the updated endowment data with all settings updated
 */
export async function updateAllSettings(
  endowId: BigNumberish,
  settings: DeepPartial<LibAccounts.SettingsPermissionStruct>,
  state: TestFacetProxyContract
) {
  const oldEndow = await state.getEndowmentDetails(endowId);
  const lockedEndow: AccountStorage.EndowmentStruct = {...oldEndow};

  lockedEndow.settingsController = (
    Object.entries(lockedEndow.settingsController) as [
      keyof LibAccounts.SettingsControllerStruct,
      LibAccounts.SettingsPermissionStruct,
    ][]
  ).reduce((controller, [key, curSetting]) => {
    controller[key] = getUpdated(curSetting, settings);
    return controller;
  }, {} as LibAccounts.SettingsControllerStruct);

  await wait(state.setEndowmentDetails(endowId, lockedEndow));
  return lockedEndow;
}

function getUpdated(
  oldSettings: LibAccounts.SettingsPermissionStruct,
  newSettings: DeepPartial<LibAccounts.SettingsPermissionStruct>
): LibAccounts.SettingsPermissionStruct {
  const result = {
    locked: newSettings.locked ?? oldSettings.locked,
    delegate: {
      addr: newSettings.delegate?.addr ?? oldSettings.delegate.addr,
      expires: newSettings.delegate?.expires ?? oldSettings.delegate.expires,
    },
  };

  return result;
}
