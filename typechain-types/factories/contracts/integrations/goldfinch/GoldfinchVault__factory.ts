/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Signer,
  utils,
  Contract,
  ContractFactory,
  BigNumberish,
  Overrides,
} from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../common";
import type {
  GoldfinchVault,
  GoldfinchVaultInterface,
} from "../../../../contracts/integrations/goldfinch/GoldfinchVault";

const _abi = [
  {
    inputs: [
      {
        internalType: "enum IVault.VaultType",
        name: "_vaultType",
        type: "uint8",
      },
      {
        internalType: "address",
        name: "_registrar",
        type: "address",
      },
      {
        internalType: "address",
        name: "_stakingPool",
        type: "address",
      },
      {
        internalType: "address",
        name: "_crvPool",
        type: "address",
      },
      {
        internalType: "address",
        name: "_usdc",
        type: "address",
      },
      {
        internalType: "address",
        name: "_fidu",
        type: "address",
      },
      {
        internalType: "address",
        name: "_gfi",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint32",
        name: "accountId",
        type: "uint32",
      },
      {
        indexed: false,
        internalType: "enum IVault.VaultType",
        name: "vaultType",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "address",
        name: "tokenDeposited",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amtDeposited",
        type: "uint256",
      },
    ],
    name: "DepositMade",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint32[]",
        name: "accountIds",
        type: "uint32[]",
      },
    ],
    name: "Harvest",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint32",
        name: "accountId",
        type: "uint32",
      },
      {
        indexed: false,
        internalType: "enum IVault.VaultType",
        name: "vaultType",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "address",
        name: "tokenRedeemed",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amtRedeemed",
        type: "uint256",
      },
    ],
    name: "Redemption",
    type: "event",
  },
  {
    inputs: [],
    name: "FIDU",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "GFI",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "USDC",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint32",
        name: "accountId",
        type: "uint32",
      },
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amt",
        type: "uint256",
      },
    ],
    name: "deposit",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "getVaultType",
    outputs: [
      {
        internalType: "enum IVault.VaultType",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint32[]",
        name: "accountIds",
        type: "uint32[]",
      },
    ],
    name: "harvest",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "onERC721Received",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint32",
        name: "",
        type: "uint32",
      },
    ],
    name: "principleByAccountId",
    outputs: [
      {
        internalType: "uint256",
        name: "usdcP",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "fiduP",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint32",
        name: "accountId",
        type: "uint32",
      },
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amt",
        type: "uint256",
      },
    ],
    name: "redeem",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
          {
            internalType: "enum IRouter.VaultActionStatus",
            name: "status",
            type: "uint8",
          },
        ],
        internalType: "struct IRouter.RedemptionResponse",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint32",
        name: "accountId",
        type: "uint32",
      },
    ],
    name: "redeemAll",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint32",
        name: "",
        type: "uint32",
      },
    ],
    name: "tokenIdByAccountId",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

const _bytecode =
  "0x6080346200012457601f620022b938819003918201601f19168301916001600160401b03831184841017620001295780849260e0946040528339810103126200012457805190600282101562000124576200005d602082016200013f565b916200006c604083016200013f565b6200007a606084016200013f565b9262000089608082016200013f565b92620000a660c06200009e60a085016200013f565b93016200013f565b9360ff6000549160018060a01b0380988180988160018060a01b03199d168d6003541617600355168b600554161760055516896004541617600455610100600160a81b039060081b1692169060018060a81b031916171760005516836001541617600155169060025416176002556040516121649081620001558239f35b600080fd5b634e487b7160e01b600052604160045260246000fd5b51906001600160a01b0382168203620001245756fe608060408181526004918236101561001657600080fd5b600092833560e01c918263034afe7b14610ede57508163150b7a0214610e655781631c2a709b14610e2757816320dcd90b146108e65781634dc237721461059957816375baf37f1461057057816388bb447b146103ca57816389a302711461039e5781639fdafa6d14610375578163c2ec3be6146100d4575063e52022691461009e57600080fd5b346100d05760203660031901126100d0578060209263ffffffff6100c0610f03565b1681526006845220549051908152f35b5080fd5b905082602092836003193601126100d0576100ed610f03565b916100fe6100f961111f565b611274565b63ffffffff8316938482526006865261011b8383205415156112b6565b6005548583526006875283832054845163eb02c30160e01b808252848201929092526001600160a01b03979261018092908916918381602481865afa90811561036b5784929161017591899161034e575b505115156112b6565b84875260068b5260248888205491895194859384928352898301525afa9182156103175790849392918692610321575b505060a08860035416875195868092635c77d24760e11b82525afa9384156103175790899493929186946102e3575b50610209906101e289611bb0565b6101ed81518a611ac8565b9861020182516101fb6119b0565b90611a3a565b915190611fb7565b96806102c4575b5084526007835284842060018101859055849055835460609290920151855163095ea7b360e01b81529088166001600160a01b0316918101918252602082018790529596949594859260081c16908290859082906040015b03925af180156102b85761027f575b505051908152f35b8482813d83116102b1575b610294818361102c565b810103126102ae57506102a69061104e565b508380610277565b80fd5b503d61028a565b508251903d90823e3d90fd5b6102d761026897988792869594966118f9565b97965092909192610210565b6102099194506103099060a03d8111610310575b610301818361102c565b8101906110a3565b93906101d4565b503d6102f7565b86513d87823e3d90fd5b6103409250803d10610347575b610338818361102c565b8101906112f0565b89806101a5565b503d61032e565b6103659150843d861161034757610338818361102c565b8d61016c565b88513d89823e3d90fd5b5050346100d057816003193601126100d05760015490516001600160a01b039091168152602090f35b5050346100d057816003193601126100d0579054905160089190911c6001600160a01b03168152602090f35b90503461056c576020908160031936011261056857803567ffffffffffffffff928382116105645736602383011215610564578183013593841161056457602494600592368787861b830101116105605784936104286100f961111f565b6003548351635c77d24760e11b8152956001600160a01b03939160a0918891829087165afa958615610556578a96610536575b50895b888110610469578a80f35b8981841b830101358b63ffffffff82168083036100d057808d9183526006808b526104988a85205415156112b6565b888854169184528a5288832054908c8a51938493849263eb02c30160e01b84528301526101809384935afa92831561052b57926104eb94926104e6928d959261050e575b50505115156112b6565b6113f5565b60001981146104fc5760010161045e565b634e487b7160e01b8b5260118852898bfd5b6105249250803d1061034757610338818361102c565b38806104dc565b8951903d90823e3d90fd5b61054f91965060a03d811161031057610301818361102c565b943861045b565b84513d8c823e3d90fd5b8780fd5b8580fd5b8380fd5b8280fd5b5050346100d057816003193601126100d05760ff602092541690519061059581610f4d565b8152f35b8391506105a536610f16565b85519294916105b384610fd8565b828452826020809501526105c86100f961111f565b6105e360018060a01b03918280865460081c16911614610f6d565b63ffffffff861691828452600685526106008885205415156112b6565b816005541696838552600686528885205489519863eb02c30160e01b91828b52898b0152610180998a81602481855afa9081156108bf578a969594939291610651918a916108c957505115156112b6565b60a085600354168d5197888092635c77d24760e11b82525afa9586156108bf578c928c928c928b9961089a575b50906024918a8c5260068d52858c20549551958694859384528301525afa998a1561089057879a610869575b505090816106ba6106cd93611bb0565b6106c58a5182611ac8565b995190611e11565b90809880610855575b505069d3c21bcecceda100000080820282810482148315171561084257928a8a93610744600161079a98956107308b868f9b8f906107219060078f86855252878484200154906113c8565b92815260078d522054906113b5565b04938a8c52600789528b20019182546113e8565b90558688526007855261075b8c89209182546113e8565b9055606081885460081c1692015116868b5180968195829463095ea7b360e01b84528d840160209093929193604081019460018060a01b031681520152565b03925af1801561083857610804575b508551946107b686610fd8565b8552828501906001825282526007835285822054156107fb575b855194518552519260058410156107e8575050820152f35b634e487b7160e01b825260219052602490fd5b600281526107d0565b8381813d8311610831575b610819818361102c565b8101031261056c5761082a9061104e565b50866107a9565b503d61080f565b87513d85823e3d90fd5b634e487b7160e01b875260118952602487fd5b610861929950846118f9565b9689806106d6565b6106cd93929a50908161088792903d1061034757610338818361102c565b9890918b6106aa565b8b513d89823e3d90fd5b6024929199506108b79060a03d811161031057610301818361102c565b98909161067e565b8c513d8a823e3d90fd5b6108e091508d803d1061034757610338818361102c565b8e61016c565b90506108f136610f16565b929193906108fd61111f565b8015610d95575b15610d6357855460081c6001600160a01b03908116916109279082168314610f6d565b61092f6119b0565b9080855416968885519463556d6e9f60e01b86528188870152856001958660248301528a60448301528b82606460209a8b935afa918215610d5957918a9b9c91899a9b99938692610d20575b509061098a86949392826113b5565b60649004610997916113e8565b8b5163095ea7b360e01b8082526001600160a01b039093169a81019a8b5260208b018f9052919990949193849291839190829060400103925af18015610d165788928c97969594928c92610cd5575b50908260849287835416908d519a8b968795630b68372160e31b87528601528a6024860152604485015260648401525af1938415610b7d578a94610ca2575b5063ffffffff1693848a5260068652868a20548015600014610b875750825460055488519283526001600160a01b039084161689830190815260208101869052879183918290036040019082908e9087165af18015610b7d579184918793610b3d575b5060449060055416988b89519a8b9485936310087fb160e01b85528401528160248401525af1958615610b33578896610afb575b50610af0906006959697848a5260078652610adb888b2091825461105b565b9055838952600785528689200191825461105b565b905585525282205580f35b909495508381813d8311610b2c575b610b14818361102c565b81010312610b2757519493610af0610abc565b600080fd5b503d610b0a565b85513d8a823e3d90fd5b8381949293503d8311610b76575b610b55818361102c565b81010312610b725760448491610b6b889461104e565b5090610a88565b8980fd5b503d610b4b565b87513d8c823e3d90fd5b835460055489519384526001600160a01b03908516168a8401908152602081018790529a9b9a9599949897969591939291879183918290036040019082908e9087165af18015610b7d57610c6e575b506005541691823b15610c6a579060448992838851958694859363a9f4939d60e01b85528401528b60248401525af18015610c6057610c44575b5090818697600793610c3f979852838352610c2f858a2091825461105b565b905587525284200191825461105b565b905580f35b90610c3f9596610c5660079493610fae565b9695509091610c10565b84513d89823e3d90fd5b8880fd5b8581813d8311610c9b575b610c83818361102c565b81010312610b7257610c949061104e565b5038610bd6565b503d610c79565b9093508581813d8311610cce575b610cba818361102c565b81010312610b7257519263ffffffff610a25565b503d610cb0565b975092905086813d8311610d0f575b610cee818361102c565b810103126102ae5760848a828a94610d068f9a61104e565b509192506109e6565b503d610ce4565b89513d85823e3d90fd5b92995092905081813d8311610d52575b610d3a818361102c565b8101031261056857518a97899290919061098a61097b565b503d610d30565b89513d86823e3d90fd5b815162461bcd60e51b8152602081850152600c60248201526b139bdd08185c1c1c9bdd995960a21b6044820152606490fd5b506003546001600160a01b0390811660a0610dae61118a565b60248651809481936342b8c5e960e01b835263ffffffff60e01b168a8301525afa908115610e1d5760209182918a91610def575b5001510151163314610904565b610e10915060a03d8111610e16575b610e08818361102c565b810190611218565b38610de2565b503d610dfe565b84513d8a823e3d90fd5b5050346100d05760203660031901126100d057809163ffffffff610e49610f03565b1681526007602052206001815491015482519182526020820152f35b90503461056c57608036600319011261056c576001600160a01b03813581811603610568576024359081160361056c576064359067ffffffffffffffff90818311610eda5736602384011215610eda5782013590811161056857369101602401116100d05751630a85bd0160e11b8152602090f35b8480fd5b8490346100d057816003193601126100d0576002546001600160a01b03168152602090f35b6004359063ffffffff82168203610b2757565b6060906003190112610b275760043563ffffffff81168103610b2757906024356001600160a01b0381168103610b27579060443590565b60021115610f5757565b634e487b7160e01b600052602160045260246000fd5b15610f7457565b60405162461bcd60e51b815260206004820152601260248201527113db9b1e481554d110c81858d8d95c1d195960721b6044820152606490fd5b67ffffffffffffffff8111610fc257604052565b634e487b7160e01b600052604160045260246000fd5b6040810190811067ffffffffffffffff821117610fc257604052565b60c0810190811067ffffffffffffffff821117610fc257604052565b6020810190811067ffffffffffffffff821117610fc257604052565b90601f8019910116810190811067ffffffffffffffff821117610fc257604052565b51908115158203610b2757565b9190820180921161106857565b634e487b7160e01b600052601160045260246000fd5b519063ffffffff82168203610b2757565b51906001600160a01b0382168203610b2757565b908160a0910312610b27576040519060a0820182811067ffffffffffffffff821117610fc257611117916080916040526110dc8161107e565b84526110ea6020820161107e565b60208501526110fb6040820161108f565b604085015261110c6060820161108f565b60608501520161108f565b608082015290565b600354604051635c77d24760e11b81526001600160a01b039160a0908290600490829086165afa801561117e57606091600091611160575b50015116331490565b611178915060a03d811161031057610301818361102c565b38611157565b6040513d6000823e3d90fd5b6040516020810160208152600960408301526808eded8c8ccd2dcc6d60bb1b6060830152606082526080820182811067ffffffffffffffff821117610fc257604052905190206001600160e01b03191690565b9190826040910312610b27576040516111f581610fd8565b80928051906002821015610b2757602061121391819385520161108f565b910152565b60a081830312610b2757604051916060830183811067ffffffffffffffff821117610fc25760405281516004811015610b275761126c92606091855261126183602083016111dd565b6020860152016111dd565b604082015290565b1561127b57565b60405162461bcd60e51b81526020600482015260136024820152722737ba1030b8383937bb32b2102937baba32b960691b6044820152606490fd5b156112bd57565b60405162461bcd60e51b815260206004820152600b60248201526a2737903837b9b4ba34b7b760a91b6044820152606490fd5b809103906101808212610b2757604080519260e084019084821067ffffffffffffffff831117610fc25760c091835283518552601f190112610b2757805161133781610ff4565b602083015181528183015160208201526060830151828201526080830151606082015260a0830151608082015260c083015160a0820152602084015260e0820151908301526101008101516060830152610120810151906002821015610b275761016091608084015261014081015160a0840152015160c082015290565b8181029291811591840414171561106857565b81156113d2570490565b634e487b7160e01b600052601260045260246000fd5b9190820391821161106857565b60018060a01b0380600554169063ffffffff918284169160009383855260206006815260409687872054948851809163eb02c30160e01b8252600497888301528160246101809485935afa9182156118ef5789926118d2575b505061145982611bb0565b611464815183611ac8565b9384156118c5578789526007845261149569d3c21bcecceda100000061148d878d8d20546113b5565b048096611d7c565b94600160ff8b54166114a681610f4d565b146117fa5790879160c088600354168d519485809263edbcc59960e01b82525afa9283156117f0579386938993898c98948f98899461173a575b50906114eb916113e8565b8187840151166114fa916113b5565b9160a0015116611509916113c8565b905190611516908961105b565b9061152092611e11565b8a859e929e52600784528c85206001019081549061153d916113e8565b90558354908c01518c5163a9059cbb60e01b8082529184166001600160a01b03169681019687526020870189905290959094859384928390604001039360081c165af19081156116dd578891611705575b50156116a457836003541660a06115a361118a565b60248b51809481936342b8c5e960e01b835263ffffffff60e01b168b8301525afa9081156116dd578a8a9285928b916116e7575b50888b858a825460081c169301966116206115f98b8d898c51015116976113e8565b9751978896879586948552840160209093929193604081019460018060a01b031681520152565b03925af19081156116dd5788916116a8575b50156116a457611650929184915101511692865460081c16976113e8565b813b15610eda5791846064928195948851998a9687956320dcd90b60e01b8752860152602485015260448401525af191821561169a57505061168f5750565b61169890610fae565b565b51903d90823e3d90fd5b8680fd5b90508281813d83116116d6575b6116bf818361102c565b81010312610560576116d09061104e565b38611632565b503d6116b5565b89513d8a823e3d90fd5b6116ff915060a03d8111610e1657610e08818361102c565b386115d7565b90508281813d8311611733575b61171c818361102c565b810103126105605761172d9061104e565b3861158e565b503d611712565b959950965050935050935060c0813d82116117e8575b8161175d60c0938361102c565b810103126117e457938a93869389936114eb8f806117d78f9b60a0908f94519361178685610ff4565b61178f8261104e565b855261179c8d830161107e565b8d8601526117ab81830161107e565b908501526117bb6060820161104e565b60608501526117cc6080820161107e565b60808501520161107e565b60a08201529390916114e0565b8a80fd5b3d9150611750565b8c513d8d823e3d90fd5b50509461181483979694899b936118539795965190611e11565b9a90938a81835460081c1694015116918a519687958694859363a9059cbb60e01b8552840160209093929193604081019460018060a01b031681520152565b03925af19081156118bb578491611886575b501561056c578252600790522060010180549091611882916113e8565b9055565b90508281813d83116118b4575b61189d818361102c565b81010312610568576118ae9061104e565b38611865565b503d611893565b85513d86823e3d90fd5b5050505050505050505050565b6118e89250803d1061034757610338818361102c565b388061144e565b8a513d8b823e3d90fd5b9291908161190691611d7c565b60008054604095860151955163a9059cbb60e01b81526001600160a01b039687166004820152602481018490529195929392602091839160449183918a9160081c165af19081156119a557859161196c575b5015610568576119699293506113e8565b90565b90506020813d821161199d575b816119866020938361102c565b81010312610eda576119979061104e565b38611958565b3d9150611979565b6040513d87823e3d90fd5b6003546040516306e7f2fd60e11b815290602090829060049082906001600160a01b03165afa90811561117e576000916119eb575b50515190565b906020823d8211611a32575b81611a046020938361102c565b810103126102ae575060405190611a1a82611010565b60405190611a2782611010565b5181528152386119e5565b3d91506119f7565b602060018060a01b03600454169160646040518094819363556d6e9f60e01b8352600160048401526000602484015260448301525afa90811561117e57600091611a96575b506064611a8f61196993836113b5565b04906113e8565b906020823d8211611ac0575b81611aaf6020938361102c565b810103126102ae5750516064611a7f565b3d9150611aa2565b919063ffffffff6000931683526007602052604083205490602060018060a01b03600454169160646040518094819363556d6e9f60e01b83526001600484015289602484015260448301525afa908115611ba5578491611b74575b50818110611b705781611b35916113e8565b69d3c21bcecceda100000090818102918183041490151715611b5c576119699293506113c8565b634e487b7160e01b84526011600452602484fd5b5050565b90506020813d8211611b9d575b81611b8e6020938361102c565b81010312610568575138611b23565b3d9150611b81565b6040513d86823e3d90fd5b6005549060009163ffffffff60018060a01b03809216921683526020906006825260409283852054813b156105645785916024839287519485938492631c4b774b60e01b845260048401525af18015611d7257611d5f575b5080600254168351916370a0823160e01b83523060048401528383602481855afa928315611d55578693611d26575b50600460a08260035416875192838092635c77d24760e11b82525afa908115611d1c57918686959392611ca29795938a91611cfe575b5001511687875180978195829463a9059cbb60e01b84526004840160209093929193604081019460018060a01b031681520152565b03925af1928315611cf557508392611cbf575b5050156102ae5750565b90809250813d8311611cee575b611cd6818361102c565b810103126100d057611ce79061104e565b3880611cb5565b503d611ccc565b513d85823e3d90fd5b611d16915060a03d811161031057610301818361102c565b38611c6d565b86513d89823e3d90fd5b9092508381813d8311611d4e575b611d3e818361102c565b81010312610b2757519138611c37565b503d611d34565b85513d88823e3d90fd5b611d6b90949194610fae565b9238611c08565b84513d87823e3d90fd5b600354604051635c77d24760e11b8152919060a090839060049082906001600160a01b03165afa801561117e5769d3c21bcecceda100000093611deb93600092611def575b50611dcc91926113b5565b6020611de163ffffffff9283855116906113b5565b92015116906113c8565b0490565b611dcc9250611e0b9060a03d811161031057610301818361102c565b91611dc1565b90929160049060018060a01b0382541690604051809263556d6e9f60e01b825260018583015260009081602484015288604484015282606460209687935afa918215611faa578192611f7b575b508115611f3f5769d3c21bcecceda1000000918281029081048303611f2c5788611e87916113c8565b92828102928184041490151715611f19575090611ea3916113c8565b948511611ecc575050611ec89083611ec2611ebc6119b0565b82611a3a565b91611fb7565b9190565b60405162461bcd60e51b815291820152602160248201527f43616e6e6f742072656465656d206d6f7265207468616e20617661696c61626c6044820152606560f81b606482015260849150fd5b634e487b7160e01b815260118552602490fd5b634e487b7160e01b825260118652602482fd5b60405162461bcd60e51b81528086018590526015602482015274496e76616c69642065786368616e6765207261746560581b6044820152606490fd5b9091508381813d8311611fa3575b611f93818361102c565b810103126100d057519038611e5e565b503d611f89565b50604051903d90823e3d90fd5b916005549060009063ffffffff60018060a01b03809416951682526020926006845260409586842054813b15610eda578491604483928a519485938492639e2c8a5b60e01b845260048401528b60248401525af180156121115761211b575b5060015460048054885163095ea7b360e01b81529084166001600160a01b03169181019190915260248101879052908590829084168187816044810103925af180156121115790859392916120d6575b5060849060045416958488519788948593630b68372160e31b855260016004860152836024860152604485015260648401525af193841561169a5750926120ac57505090565b90809250813d83116120cf575b6120c3818361102c565b81010312610b27575190565b503d6120b9565b90919281813d831161210a575b6120ed818361102c565b810103126105685784929161210360849261104e565b5090612066565b503d6120e3565b87513d86823e3d90fd5b61212790939193610fae565b913861201656fea2646970667358221220b0e60d721650270c68bd7c0506eafaf487a105e2b5d923715d8d1a5fb7d0183b64736f6c63430008120033";

type GoldfinchVaultConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: GoldfinchVaultConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class GoldfinchVault__factory extends ContractFactory {
  constructor(...args: GoldfinchVaultConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    _vaultType: PromiseOrValue<BigNumberish>,
    _registrar: PromiseOrValue<string>,
    _stakingPool: PromiseOrValue<string>,
    _crvPool: PromiseOrValue<string>,
    _usdc: PromiseOrValue<string>,
    _fidu: PromiseOrValue<string>,
    _gfi: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<GoldfinchVault> {
    return super.deploy(
      _vaultType,
      _registrar,
      _stakingPool,
      _crvPool,
      _usdc,
      _fidu,
      _gfi,
      overrides || {}
    ) as Promise<GoldfinchVault>;
  }
  override getDeployTransaction(
    _vaultType: PromiseOrValue<BigNumberish>,
    _registrar: PromiseOrValue<string>,
    _stakingPool: PromiseOrValue<string>,
    _crvPool: PromiseOrValue<string>,
    _usdc: PromiseOrValue<string>,
    _fidu: PromiseOrValue<string>,
    _gfi: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      _vaultType,
      _registrar,
      _stakingPool,
      _crvPool,
      _usdc,
      _fidu,
      _gfi,
      overrides || {}
    );
  }
  override attach(address: string): GoldfinchVault {
    return super.attach(address) as GoldfinchVault;
  }
  override connect(signer: Signer): GoldfinchVault__factory {
    return super.connect(signer) as GoldfinchVault__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): GoldfinchVaultInterface {
    return new utils.Interface(_abi) as GoldfinchVaultInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): GoldfinchVault {
    return new Contract(address, _abi, signerOrProvider) as GoldfinchVault;
  }
}
