import { parseStringPromise } from 'xml2js';
import randomstring from "randomstring";
import BookingNotificationMMT from '../../../../models/Notifications/mmtBookingNotification.js';
import roomAndRateMap from '../../../../models/OTAs/mappedRoomsAndRates.js';
import holdBooking from '../../../../models/holdBooking.js';
import { getCurrentUTCTimestamp } from '../../../../helpers/helper.js';
const pushBookingNotificationMMT = async (req, res) => {
    try {

        const xmlData = req.body; // Assuming the XML data is in the request body
        const xmlData2 = `<?xml version="1.0" encoding="UTF-8"?>
<BookingDetail>
    <Booking Id="0000058821">
        <HotelName>Royal Tycoon Place Hotel </HotelName>
        <HotelCode>1000282881</HotelCode>
        <GuestName>Ranbir Kapoor</GuestName>
        <BookingDate>2023-09-13 15:13:30</BookingDate>
        <CheckInDate>2023-09-18</CheckInDate>
        <CheckoutDate>2023-08-20</CheckoutDate>
        <NumberOfNights>1</NumberOfNights>
        <RoomTypeName>Deluxe Room</RoomTypeName>
        <RoomTypeCode>45000485844</RoomTypeCode>
        <RatePlanName>free cancellation pay at hotel</RatePlanName>
        <RatePlanCode>990001678678</RatePlanCode>
        <NumberofRooms>1</NumberofRooms>
        <Price>1500.0</Price>
        <BookingStatus>refunded</BookingStatus>
        <PayAtHotelFlag>True</PayAtHotelFlag>
        <TaxPayableAtHotel>False</TaxPayableAtHotel>
        <Currency short="THB">Thai baht</Currency>
        <ContractType>b2c</ContractType>
        <VendorBookingId></VendorBookingId>
        <BookingVendorName>Goibibo</BookingVendorName>
        <GuestEmail>vardhman.golcha@go-mmt.com</GuestEmail>
        <GuestPhoneNo>NA</GuestPhoneNo>
        <CorporateGstn></CorporateGstn>
        <CreatedTime>2018-03-15 16:17:54</CreatedTime>
        <LastModifiedTime>2018-03-15 16:18:32</LastModifiedTime>
        <CustomerGstInfo>
            <Gstn>100000</Gstn>
            <CompanyName>Makemytrip</CompanyName>
            <CompanyAddress>Gurgaon</CompanyAddress>
        </CustomerGstInfo>
        <OriginalBookingId>0000058808</OriginalBookingId>
        <PriceDetails>
            <SellAmount>1500.0</SellAmount>
            <NettAmount>1181.4</NettAmount>
            <TotalTcsAmount>0</TotalTcsAmount>
            <PayAtHotelAmount>2000.0</PayAtHotelAmount>
            <TaxPayAtHotelAmount>0</TaxPayAtHotelAmount>
            <TotalPayAtHotelAmount>2040.0</TotalPayAtHotelAmount>
            <GST>0</GST>
            <RoomBreakup>
                <Rooms date="2017-12-27">
                    <Room quantity="1" unitprice="1000.0"/>
                </Rooms>
            </RoomBreakup>
            <DayRoomBreakup>
                <Day date="2019-05-15">
                    <Room name="shiju - DoNotBook" number="1">
                        <OriginalPrice>100.0</OriginalPrice>
                        <IsCppRateUsed>False</IsCppRateUsed>
                        <PrePurchasePrice>None</PrePurchasePrice>
                        <IsPreBuy>0</IsPreBuy>
                        <IsDiscountApplied>True</IsDiscountApplied>
                        <DiscountPercent>10.0</DiscountPercent>
                        <IsOrcApplied>False</IsOrcApplied>
                        <OrcPercent>None</OrcPercent>
                        <IsZcr>False</IsZcr>
                        <IsCouponApplied>True</IsCouponApplied>
                        <CouponPercent>5</CouponPercent>
                        <CouponValue>4.5</CouponValue>
                        <BasePrice>85.5</BasePrice>
                        <OriginalExtraGuestPrice>0.0</OriginalExtraGuestPrice>
                        <ExtraGuestPrice>0.0</ExtraGuestPrice>
                        <TaxAmount>0.0</TaxAmount>
                        <TaxPercent>0</TaxPercent>
                        <TaxOnExtraGuest>0.0</TaxOnExtraGuest>
                        <OriginalNettAmount>82.0</OriginalNettAmount>
                        <NettAmount>70.11</NettAmount>
                        <NettAmountWithTax>70.11</NettAmountWithTax>
                        <OriginalNettExtraGuestPrice>0.0</OriginalNettExtraGuestPrice>
                        <NettExtraGuestPrice>0.0</NettExtraGuestPrice>
                        <Commission>15.39</Commission>
                        <CommissionPercent>18.0</CommissionPercent>
                        <ServiceCharge>0.0</ServiceCharge>
                        <TcsAmount>0.0</TcsAmount>
                    </Room>
                </Day>
            </DayRoomBreakup>
        </PriceDetails>
        <RoomStay>
            <Room>
                <Adult>2</Adult>
                <Child>0</Child>
            </Room>
        </RoomStay>
        <Inclusions>
            <Inclusion>Accommodation</Inclusion>
        </Inclusions>
        <CancellationPolicy>
            <PolicyParameters>
                <Charge>100</Charge>
                <ChargeType>percent</ChargeType>
                <StartDay>-1</StartDay>
                <EndDay>1</EndDay>
                <PolicyText>If You cancel your Hotel booking within 24 hrs of Check In date. Cancellation charges will be 100 Percent Cost.</PolicyText>
            </PolicyParameters>
            <PolicyParameters>
                <Charge>0</Charge>
                <ChargeType>percent</ChargeType>
                <StartDay>1</StartDay>
                <EndDay>365</EndDay>
                <PolicyText>If You cancel your Hotel booking on and before 1 day of Check In date. Cancellation charges will be 100 Percent Cost.</PolicyText>
            </PolicyParameters>
        </CancellationPolicy>
        <SpecialRequest>None</SpecialRequest>
        <SpecialRequestStatus>None</SpecialRequestStatus>
        <ExpectedArrivalTime>None</ExpectedArrivalTime>
        <Payment>
            <ExpiryDate>0518</ExpiryDate>
            <CreditCardType>MC</CreditCardType>
            <CreditCardNumber>5329601697022109</CreditCardNumber>
            <CreditCardName>MAKEMYTRIP (INDIA) VCA</CreditCardName>
            <CreditCardCvv>289</CreditCardCvv>
        </Payment>
        <AddOnDetails>
            <AddOn>
                <Code>ABCDEFGHIJKLMNO</Code> 
                <Info>
                    <Type></Type>
                    <Text></Text> 
                    <BasedOn></BasedOn> 
                    <ConfirmationType></ConfirmationType>
                    <ChargeType></ChargeType> 
                    <ChargeValue></ChargeValue>
                    <CancellationRule></CancellationRule> 
                </Info>
                <Units></Units> 
                <SellAmount></SellAmount>
                <NetAmount></NetAmount>
                <TaxAmount></TaxAmount>
                <CommissionBreakUp>
                    <CommisionAmount></CommisionAmount>
                    <TotalServiceTaxOnCommision></TotalServiceTaxOnCommision>
                </CommissionBreakUp>
                <Message></Message> 
                <PayMode></PayMode> 
            </AddOn>
        </AddOnDetails>
        <PreBuyDetails>
            <DayBreakup>
                <Day date="2017-12-27">
                    <Inventory>
                        <PreBuyPool>0</PreBuyPool>
                        <CommonPool>1</CommonPool>
                    </Inventory>
                </Day>
            </DayBreakup>
        </PreBuyDetails>
    </Booking>
</BookingDetail>
`;
        // console.log(xmlData,"hgcgh")
        // Convert XML to JSON using promises
        const result = await parseStringPromise(xmlData, { explicitArray: false, mergeAttrs: true });
        const result2 = await parseStringPromise(xmlData2, { explicitArray: false, mergeAttrs: true });

        const bookingData = result.Booking;
        const otaBookingData = result2.BookingDetail
        // console.log(typeof bookingData.HotelCode)
        // console.log(bookingData.HotelCode)
        // console.log(result);

        const getIds = await roomAndRateMap.findOne({ OTAHotelCode: bookingData.HotelCode }, 'otaId propertyId').lean()
        // console.log(getIds, "asda")
        // console.log(getIds.propertyId, getIds.otaId)
        // Create a new document using Mongoose model
        const newBookingNotification = new BookingNotificationMMT({
            propertyId: getIds.propertyId || "",
            
            otaId: getIds.otaId || "",
            createdOn: await getCurrentUTCTimestamp(),
            Booking: {
                bookingId: bookingData.BookingId,
                customerName: bookingData.CustomerName,
                noOfRooms: parseInt(bookingData.NoOfRooms),
                noOfNights: parseInt(bookingData.NoOfNights),
                roomTypeName: bookingData.RoomTypeName,
                checkInDate: bookingData.CheckInDate,
                status: bookingData.Status,
                hotelCode: bookingData.HotelCode,
                payAtHotelFlag: bookingData.PayAtHotelFlag === 'True',
                bookingTime: new Date(bookingData.BookingTime),
                bookingVendorName: bookingData.BookingVendorName
            }
        });
        const savedBooking = await newBookingNotification.save();

        const saveOTABooking = new holdBooking({
            guestId: randomstring.generate(8),
            reservationNumber: randomstring.generate({
                charset: 'numeric',
                length: 4
            }),
            bookingId: otaBookingData.Booking.Id || "",
            propertyId: getIds.propertyId || "",
            guestName: [{ guestName: otaBookingData.Booking.GuestName || "", logId: randomstring.generate(10) }],
            adults: [{
                adults: otaBookingData.Booking.RoomStay.Room.Adult || "",
                logId: randomstring.generate(10)
            }],
            childs: [{
                childs: otaBookingData.Booking.RoomStay.Room.Child || "",
                logId: randomstring.generate(10)
            }],
            nightCount: [{
                nightCount: otaBookingData.Booking.NumberOfNights || "",
                logId: randomstring.generate(10)
            }],
            bookingTime: otaBookingData.Booking.BookingDate || "",
            checkInDate: [{
                checkInDate: otaBookingData.Booking.CheckInDate || "",
                logId: randomstring.generate(10)
            }],
            checkOutDate: [{
                checkOutDate: otaBookingData.Booking.CheckoutDate || "",
                logId: randomstring.generate(10)
            }],
            reservationRate: [{
                roomCharges: [{
                    grandTotal: otaBookingData.Booking.PriceDetails.TotalPayAtHotelAmount || ''
                }],
                logId: randomstring.generate(10),
            }],
            inventory: otaBookingData.Booking.NumberofRooms || 0,
            isOTABooking: "true",
            otaId: getIds.otaId || ""
        })

        await saveOTABooking.save();

        // Save the document to the database

        // console.log('Booking notification saved:', savedBooking);

        return res.status(200).json({ result2, statuscode: 200 });
    } catch (error) {
        console.error('Error parsing XML:', error);
        return res.status(500).json({ message: 'Internal Server Error', statuscode: 500 });
    }
};

export default pushBookingNotificationMMT;
