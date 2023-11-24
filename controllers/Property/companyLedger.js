
import comapnyLedger from "../../models/companyLedger.js";
import company from "../../models/company.js"
import randomString from "randomstring"

export const addComapnyLedger = async (req, res) => {
    const { companyId } = req.query
    // const {creditLimit}


    const companyDetails = await comapnyLedger.findOne({ companyId: companyId })


    if (!companyDetails) {
        return res.status(404).json({ message: "Data not found", statusCode: 404 })
    }


    if (companyDetails) {
        const logId1 = Randomstring.generate(10)
        const update1 = {
            $push: {
                creditLimit: {
                    $each: [
                        {
                            creditLimit: yourCreditLimitValue,
                            logId: yourLogIdValue,
                        },
                    ],
                    $position: 0,
                },
            },
        };
        const updatedBookingSourceName = await bookingSourceModel.findOneAndUpdate({ bookingSourceId: bookingSourceId }, update1, {
            new: true
        });
    }

    // const {creditLimit, totalBalance, ledger} = companyDetails

    // const addLedger = comapnyLedger ({

    //     creditLimit: [{
    //         creditLimit : creditLimit,
    //         logId : randomString.generate(10)
    //       }],


    //       totalBalance:[{
    //         totalBalance : totalBalance,
    //         logId : randomString.generate(10)
    //       }],


    //       ledger : [{
    //         ledger : ledger,
    //         logId : randomString.generate(10)
    //       }],

    // })







}