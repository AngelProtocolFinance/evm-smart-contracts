import fs from "fs"
import path from "path"

export const cleanFile = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const contractsDir = path.join(__dirname, "../")

            if (!fs.existsSync(contractsDir)) {
                fs.mkdirSync(contractsDir)
            }

            fs.writeFileSync(
                path.join(contractsDir, "contract-address.json"),
                JSON.stringify(
                    { INFO: "ALL ADDRESS ARE MENTIONED INTO THIS FILE" },
                    undefined,
                    2
                )
            )
            resolve(true)
        } catch (e) {
            reject(e)
        }
    })
}

export const saveFrontendFiles = (addressesObj: object) => {
    return new Promise(async (resolve, reject) => {
        try {
            const contractsDir = path.join(__dirname, "../")

            if (!fs.existsSync(contractsDir)) {
                fs.mkdirSync(contractsDir)
            }

            const jsonData = fs.readFileSync(
                path.join(contractsDir, "contract-address.json"),
                "utf-8"
            )

            const data = JSON.parse(jsonData)

            Object.assign(data, addressesObj)

            fs.writeFileSync(
                path.join(contractsDir, "contract-address.json"),
                JSON.stringify(data, undefined, 2)
            )
            resolve(true)
        } catch (e) {
            reject(e)
        }
    })
}
