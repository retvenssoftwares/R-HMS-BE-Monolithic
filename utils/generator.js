import { parseString, Builder } from 'xml2js';


    //     const xmlData = `
    //     <?xml version="1.0" encoding="UTF-8"?>
    //     <Booking HotelCode="1000000025">
    //       <BookingId>0000057475</BookingId>
    //       <CustomerName>Vaddy Jain</CustomerName>
    //       <NoOfRooms>1</NoOfRooms>
    //       <NoOfNights>1</NoOfNights>
    //       <RoomTypeName>Deluxe Room</RoomTypeName>
    //       <CheckInDate>2017-11-15</CheckInDate>
    //       <Status>booked</Status>
    //       <PayAtHotelFlag>False</PayAtHotelFlag>
    //       <BookingTime>2017-10-26 18:15:43</BookingTime>
    //       <BookingVendorName>Goibibo</BookingVendorName>
    //     </Booking>
    //   `;

    const xmlData = `<?xml version="1.0" encoding="UTF-8"?>
<BookingDetail>
    <Booking Id="0000058809">
        <HotelName>Royal Tycoon Place Hotel </HotelName>
        <HotelCode>1000084920</HotelCode>
        <GuestName>Amit Jain</GuestName>
        <BookingDate>2017-11-21 15:13:30</BookingDate>
        <CheckInDate>2017-12-27</CheckInDate>
        <CheckoutDate>2017-12-28</CheckoutDate>
        <NumberOfNights>1</NumberOfNights>
        <RoomTypeName>Executive</RoomTypeName>
        <RoomTypeCode>45000070621</RoomTypeCode>
        <RatePlanName>free cancellation pay at hotel</RatePlanName>
        <RatePlanCode>990000419959</RatePlanCode>
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
            <TotalPayAtHotelAmount>2000.0</TotalPayAtHotelAmount>
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

    // Convert XML to JSON
    parseString(xmlData, { explicitArray: false, mergeAttrs: true }, (err, result) => {
        if (err) {
            console.error('Error parsing XML:', err);
        } else {
            // const bookingData = result.Booking;
            console.log(result)

            // Function to convert JSON to XML
            const convertJsonToXml = (jsonData) => {
                const builder = new Builder({ headless: true, renderOpts: { pretty: false } });
                const xmlData = builder.buildObject({ root: jsonData });

                return xmlData;
            };

            const xmlData = convertJsonToXml(result);
            console.log(xmlData);
        }
    });


