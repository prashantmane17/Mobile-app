import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { ArrowLeft, Download, Share2 } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { getOrgProfie } from '../../api/admin/adminApi';
import { getAllProformaInvoices } from '../../api/user/proformaInvoice';

// Sample invoice data - you can replace this with your actual data
const invoiceData = {
  declaration: 'We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct',
};

const ProformaInvoiceDetails = ({ route }) => {
  const [loading, setLoading] = useState(false);
  const [invoiceLoading, setInvoiceLoading] = useState(false);
  const { id } = route.params;
  const navigation = useNavigation();
  const [invoices, setInvoices] = useState({})
  const [orgData, setOrgData] = useState({})
  const [isSameState, setIsSameSate] = useState(false)
  const invoiceDatas = async () => {
    setInvoiceLoading(true);
    try {
      const response = await getAllProformaInvoices();
      const orgResponse = await getOrgProfie();
      const data = response.invoices.find((invoice) => invoice.id === id)
      setInvoices(data);
      setOrgData(orgResponse.organizationList[0]);
      const orgState = orgResponse.organizationList[0].state;
      const placeOfSupply = data.customer.placeOfSupply;
      if (orgState === placeOfSupply) {
        setIsSameSate(true)
      } else {
        setIsSameSate(false)
      }
    } catch (error) {
      console.error("Error fetching invoices:", error);
    }
    finally {
      setInvoiceLoading(false);
    }
  };


  useEffect(() => {
    invoiceDatas();
  }, [id]);
  let subTotal = 0;
  let totalQTY = 0;

  const numberToWords = (num) => {
    if (num === 0) return "Zero Rupees Only";

    const belowTwenty = [
      "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
      "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen",
      "Eighteen", "Nineteen"
    ];

    const tens = [
      "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
    ];

    const units = ["", "Thousand", "Lakh", "Crore"];

    function convertLessThanThousand(n) {
      if (n < 20) return belowTwenty[n];
      if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + belowTwenty[n % 10] : "");
      return belowTwenty[Math.floor(n / 100)] + " Hundred" + (n % 100 !== 0 ? " " + convertLessThanThousand(n % 100) : "");
    }

    let [rupees, paise] = num?.toFixed(2).split(".");
    rupees = parseInt(rupees, 10);
    paise = parseInt(paise, 10);

    let words = "";
    let unitIndex = 0;

    while (rupees > 0) {
      let part = rupees % 1000;
      if (part !== 0) {
        words = convertLessThanThousand(part) + (units[unitIndex] ? " " + units[unitIndex] : "") + " " + words;
      }
      rupees = Math.floor(rupees / 1000);
      unitIndex++;
    }

    words = words.trim() + " Rupees";

    if (paise > 0) {
      words += " and " + convertLessThanThousand(paise) + " Paise";
    }

    return words + " Only";
  };

  const taxSummary = {};
  let allTaxTotal = 0;

  invoices.items?.forEach((item) => {
    const itemTotal = Number(item.quantity) * Number(item.sellingPrice);
    const ItaxRate = Number(item.interStateTax);
    const GtaxRate = Number(item.intraStateTax);

    const applicableTaxRate = isSameState ? GtaxRate : ItaxRate;
    if (applicableTaxRate === 0) return;

    const totalTax = (itemTotal * applicableTaxRate) / 100;

    if (!taxSummary[applicableTaxRate]) {
      taxSummary[applicableTaxRate] = 0;
    }
    allTaxTotal += totalTax;
    taxSummary[applicableTaxRate] += totalTax;
  });





  const generateHTML = () => {
    ActivityIndicator
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Invoice</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 10px 20px;
              padding: 0;
              font-size: 12px;
            }
            .invoice-container {
              width: 100%;
              max-width: 800px;
              margin: 0 auto;
              border: 1px solid #000;
            }
            .header {
              text-align: center;
              padding: 10px;
              border-bottom: 1px solid #000;
            }
            .header h1 {
              margin: 0;
              font-size: 18px;
            }
            .company-details {
              text-align: center;
              margin-bottom: 5px;
            }
            .invoice-info {
              display: flex;
            }
            .customer-info {
              width: 50%;
              padding: 10px;
              border-right: 1px solid #000;
            }
            .invoice-meta {
              width: 50%;

            }
            .meta-row {
              display: flex;
              padding: 10px;
              border-bottom: 1px solid #000;
            }
            .meta-row:last-child {
              border:none;
            }
            .meta-label {
              width: 50%;
              font-weight: bold;
            }
            .meta-value {
              width: 50%;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              
            }
            th, td {
              border: 1px solid #000;
              padding: 5px;
              text-align: left;
            }
            th {
              background-color: #f2f2f2;
            }
            .text-right {
              text-align: right;
            }
            .text-center {
              text-align: center;
            }
            .totals {
              display: flex;
              justify-content: space-between;
              
            }
            .total-quantity {
              width: 50%;
              padding: 10px;
              // border-right: 1px solid #000;
            }
            .total-amount {
              width: 50%;
              padding: 10px;
              text-align: right;
            }
            .amount-in-words {
              padding: 10px;
              border-top: 1px solid #000;
              border-bottom: 1px solid #000;
            }
            .footer {
              display: flex;
            }
            .declaration {
              width: 50%;
              padding: 10px;
              border-right: 1px solid #000;
            }
            .bank-details {
              width: 50%;
              padding: 10px;
            }
            .signatures {
              display: flex;
              border-top: 1px solid #000;
            }
            .customer-signature {
              width: 50%;
              padding: 10px;
              height: 80px;
              border-right: 1px solid #000;
            }
            .company-signature {
              width: 50%;
              padding: 10px;
              height: 80px;
              text-align: right;
            }
            .page-footer {
              text-align: center;
              padding: 5px;
              font-size: 10px;
              border-top: 1px solid #000;
            }
            .gst_email{
              display: flex;
              align-items: center;
              justify-content: space-between;
            }
              .emial_div{
              text-align : right;
              }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            <!-- Header -->
            <div class="header">
              <h1>${orgData.businessName}</h1>
              <div class="company-details">
                ${orgData.city}
              </div>
              
              <div class="company-details">
                ${orgData.state}, ${orgData.country}
              </div>
              <div class="gst_email">
                  <div class="gst_div">
                    GSTIN: ${orgData.gstin}
                  </div>
                  <div class="email_div">
                  Email: ${orgData.email}
                </div>
              </div>
            </div>
            <!-- Invoice Info -->
            <div class="invoice-info">
              <div class="customer-info">
                <div><strong>Bill To</strong></div>
                <div>${invoices.customer.displayName}</div>
                <div>${invoices.customer.billingAddress.addressLine1}</div>
                <div>Ph: ${invoices.customer.phone}</div>
                <div>GSTIN: ${invoices.customer.gstin || ''}</div>
                <div>PAN: ${invoices.customer.billingAddress || ''}</div>
                <div>State: ${invoices.customer.billingAddress.state || '--'}</div>
              </div>
              <div class="invoice-meta">
                <div class="meta-row">
                  <div class="meta-label">Invoice No:</div>
                  <div class="meta-value">${invoices.invoiceNumber}</div>
                </div>
                <div class="meta-row">
                  <div class="meta-label">Invoice Date:</div>
                  <div class="meta-value">${invoices.invoiceDate}</div>
                </div>
                <div class="meta-row">
                  <div class="meta-label">Ship To:</div>
                  <div class="meta-value">${invoices.customer.shippingAddress.addressLine1}</div>
                </div>
                <div class="meta-row">
                  <div class="meta-label">Terms Of Delivery:</div>
                  <div class="meta-value">${invoices.terms}</div>
                </div>
                
              </div>
            </div>
            
            <!-- Items Table -->
            <table>
              <thead>
                <tr>
                  <th>S.NO</th>
                  <th>Description of goods</th>
                  <th>HSN/SAC</th>
                  <th>Quantity</th>
                  <th>Rate</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                ${invoices.items.map((item, index) => {
      const itemTotal = Number(item.sellingPrice) * Number(item.quantity)
      return (`
                  <tr>
                    <td>${index + 1}</td>
                    <td>${item.itemName}</td>
                    <td>${item.itemHsn}</td>
                    <td>${item.quantity}</td>
                    <td class="text-right">${item.sellingPrice.toFixed(2)}</td>
                    <td class="text-right">${itemTotal.toFixed(2)}</td>
                  </tr>
                `)
    }).join('')}
                <tr>
                  <td colspan="5" class="text-right">Sub Total</td>
                  <td class="text-right">${subTotal.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
            
            <!-- Totals -->
            <div class="totals">
              <div class="total-quantity">
                Total Quantity : ${totalQTY}
              </div>
              <div class="total-amount">
                Discount  : (-) ${invoices.discountInput}
              </div>
               <div class="total-amount">
                <strong>Total Amount : ${subTotal.toFixed(2)}</strong>
              </div>
            </div>
            
            <!-- Amount in Words -->
            <div class="amount-in-words">
              <div><strong>Amount Chargeable (In Words)</strong></div>
              <div>${numberToWords(subTotal)}</div>
            </div>
            
            <!-- Footer -->
            <div class="footer">
              <div class="declaration">
                <div><strong>Declaration:</strong></div>
                <div>${invoiceData.declaration}</div>
              </div>
              <div class="bank-details">
                <div><strong>Company's Bank Details:</strong></div>
                <div>Account Holders Name : ${orgData.businessName}</div>
                <div>Bank Name : ${orgData.businessName}</div>
                <div>A/c No : ${orgData.accountNumber}</div>
                <div>IFSC Code : ${orgData.ifscCode}</div>
                <div>Branch : ${orgData.city}</div>
              </div>
            </div>
            
            <!-- Signatures -->
            <div class="signatures">
              <div class="customer-signature">
                <div>Customer Signature and Seal</div>
              </div>
              <div class="company-signature">
                <div style="margin-top: 60px;">Authorized Signature</div>
              </div>
            </div>
            
            <!-- Page Footer -->
            <!-- <div class="page-footer">
              Powered By Portstay
            </div>-->
          </div>
        </body>
      </html>
    `;
  };

  const generatePDF = async () => {
    try {
      setLoading(true);
      const { uri } = await Print.printToFileAsync({
        html: generateHTML(),
        base64: false
      });

      setLoading(false);
      return uri;
    } catch (error) {
      setLoading(false);
      console.error('Error generating PDF:', error);
      Alert.alert('Error', 'Failed to generate PDF');
      return null;
    }
  };

  const savePDF = async (uri) => {
    if (Platform.OS === 'android') {
      const permissions = await MediaLibrary.requestPermissionsAsync();

      if (permissions.granted) {
        try {
          const asset = await MediaLibrary.createAssetAsync(uri);
          await MediaLibrary.createAlbumAsync('Invoices', asset, false);
          Alert.alert('Success', 'Invoice saved to gallery');
        } catch (error) {
          console.error('Error saving to gallery:', error);
          Alert.alert('Error', 'Failed to save invoice to gallery');
        }
      } else {
        Alert.alert('Permission Required', 'Storage permission is required to save the invoice');
      }
    } else {
      Alert.alert('Success', 'Invoice saved successfully');
    }
  };

  const handleDownloadPDF = async () => {
    const uri = await generatePDF();
    if (uri) {
      await savePDF(uri);
    }
  };

  const handleSharePDF = async () => {
    const uri = await generatePDF();
    if (uri) {
      try {
        await Sharing.shareAsync(uri);
      } catch (error) {
        console.error('Error sharing PDF:', error);
        Alert.alert('Error', 'Failed to share PDF');
      }
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-4 py-4 shadow-sm">
        <View className="flex-row justify-between items-center">
          <TouchableOpacity className="p-2 rounded-full bg-gray-100" onPress={() => navigation.navigate('Pinvoice')}>
            <ArrowLeft stroke="#333" width={22} height={22} />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-800">ProformaInvoice</Text>
          <View className="flex-row space-x-3">
            <TouchableOpacity
              className="p-2.5 rounded-full bg-gray-100"
              onPress={handleDownloadPDF}
            >
              <Download stroke="#333" width={20} height={20} />
            </TouchableOpacity>
            <TouchableOpacity
              className="p-2.5 rounded-full bg-gray-100"
              onPress={handleSharePDF}
            >
              <Share2 stroke="#333" width={20} height={20} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {(loading || invoiceLoading) ? (
        <View className="flex-1 justify-center items-center bg-white">
          <ActivityIndicator size="large" color="#333" />
          <Text className="mt-4 text-gray-600">Generating invoice PDF...</Text>
        </View>
      ) : (
        <ScrollView className="flex-1">
          <View className="m-4 bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Company Header */}
            <View className="p-4 ">
              <Text className="text-xl font-bold text-center">{orgData.businessName}</Text>
              <Text className="text-sm text-center text-gray-600">{orgData.city}</Text>
              <Text className="text-sm text-center text-gray-600">
                {orgData.state}, {orgData.country}
              </Text>
            </View>
            <View className="flex-row justify-between w-full px-1">
              <Text className="text-sm text-gray-600 w-1/2">GSTIN: {orgData.gstin ? orgData.gstin : "--"}</Text>
              <Text className="text-sm text-gray-600 text-right w-1/2">Email: {orgData.email}</Text>
            </View>
            {/* Customer and Invoice Info */}
            <View className="flex-row p-1">
              {/* Customer Info */}
              <View className="w-1/2 p-2 border border-gray-200">
                <Text className="font-bold mb-1">Bill To:</Text>
                <Text>{invoices.customer?.displayName}</Text>
                <Text className="text-gray-600 text-sm">{invoices.customer?.billingAddress?.addressLine1}</Text>
                <Text className="text-gray-600 text-sm">
                  State : {invoices.customer?.billingAddress?.state || ''}
                </Text>
                <Text className="text-gray-600 text-sm">Ph: {invoices.customer?.billingAddress?.phone}</Text>
                <Text className="text-gray-600 text-sm">GSTIN: {invoices.customer?.gstin || ''}</Text>
              </View>

              {/* Invoice Meta */}
              <View className="w-1/2 ">
                <View className="flex-row  border border-gray-200 p-2">
                  <Text className="w-1/2 font-bold text-[13px]">Invoice No:</Text>
                  <Text className="w-1/2 text-[13px]">{invoices.invoiceNumber}</Text>
                </View>
                <View className="flex-row  border border-gray-200 p-2">
                  <Text className="w-1/2 font-bold text-[13px]">Invoice Date:</Text>
                  <Text className="w-1/2 text-[13px]">{invoices.invoiceDate}</Text>
                </View>
                <View className="flex-row  border border-gray-200 p-2">
                  <Text className="w-1/2 font-bold text-[13px]">Ship To:</Text>
                  <Text className="w-1/2 text-sm text-[13px]">{invoices.customer?.shippingAddress.addressLine1}</Text>
                </View>
                <View className="flex-row  border border-gray-200 p-2">
                  <Text className="w-1/2 font-bold text-[13px]">Place of supply:</Text>
                  <Text className="w-1/2 text-[13px]">{invoices.customer?.placeOfSupply}</Text>
                </View>
                <View className="flex-row  border border-gray-200 p-2 ">
                  <Text className="w-1/2 font-bold text-[13px]">Terms Of Delivery:</Text>
                  <Text className="w-1/2 text-[13px]">{invoices.terms}</Text>
                </View>
                {/* <View className="flex-row">
                  <Text className="w-1/2 font-bold">Vehicle Number:</Text>
                  <Text className="w-1/2">{invoiceData.invoice.vehicleNumber}</Text>
                </View> */}
              </View>
            </View>

            {/* Items Table */}
            <ScrollView horizontal>
              <View className="min-w-full">
                {/* Table Header */}
                <View className="flex-row bg-gray-100 border-b border-gray-200">
                  <Text className="w-12 p-2 font-bold border-r border-gray-200 text-[12px]">S.NO</Text>
                  <Text className="w-40 p-2 font-bold border-r border-gray-200 text-[12px]">Description of goods</Text>
                  <Text className="w-24 p-2 font-bold border-r border-gray-200 text-[12px]">HSN/SAC</Text>
                  <Text className="w-24 p-2 font-bold border-r border-gray-200 text-[12px]">Quantity</Text>
                  <Text className="w-24 p-2 font-bold border-r border-gray-200 text-[12px]">GST</Text>
                  <Text className="w-20 p-2 font-bold border-r border-gray-200 text-[12px]">Rate</Text>
                  <Text className="w-24 p-2 font-bold">Amount</Text>
                </View>

                {/* Table Rows */}
                {invoices.items?.map((item, index) => {

                  let totalAmount = Number(item.sellingPrice) * Number(item.quantity)
                  subTotal += totalAmount
                  totalQTY += Number(item.quantity)
                  return (
                    <View key={index} className="flex-row border-b border-gray-200">
                      <Text className="w-12 p-2 border-r border-gray-200 text-[12px]">{index + 1}</Text>
                      <Text className="w-40 p-2 border-r border-gray-200 text-[12px]">{item.itemName}</Text>
                      <Text className="w-24 p-2 border-r border-gray-200 text-[12px]">{item.itemHsn}</Text>
                      <Text className="w-24 p-2 border-r border-gray-200 text-[12px]">{item.quantity}</Text>
                      {isSameState ? (<Text className="w-24 p-2 border-r border-gray-200 text-[12px]">{item.intraStateTax}%</Text>
                      ) : (<Text className="w-24 p-2 border-r border-gray-200 text-[12px]">{item.interStateTax}%</Text>)}
                      <Text className="w-20 p-2 text-right border-r border-gray-200 text-[12px]">{item.sellingPrice?.toFixed(2)}</Text>
                      <Text className="w-24 p-2 text-right text-[12px]">{totalAmount.toFixed(2)}</Text>
                    </View>
                  )
                })}

                {/* Sub Total */}

              </View>
            </ScrollView>

            {/* Totals */}
            <View className="flex-row border-b border-gray-200">
              <View className="w-1/2 p-4 border-r border-gray-200">
                <Text>Total Quantity : {totalQTY}</Text>
              </View>
              <View className="w-1/2 p-4">
                <View className="flex-row justify-between items-center mb-2">
                  <Text className=" flex-1 text-left font-bold text-[13px]">Sub Total :</Text>
                  <Text className="w-20 text-right font-bold text-[13px]">{subTotal.toFixed(2)}</Text>
                </View>
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="  flex-1 text-left text-[13px]">Discount :</Text>
                  <Text className="w-20 text-right text-[13px]">{invoices.discountInput}</Text>
                </View>

                {Object.entries(taxSummary).map(([rate, totalTax], index) => (
                  <View key={index}>
                    {isSameState ? (
                      <View>
                        <View className="flex-row justify-between items-center mb-2">
                          <Text className="flex-1 text-left text-[13px]">SGST ({rate}%):</Text>
                          <Text className="w-20 text-right text-[13px]">{(totalTax / 2).toFixed(2)}</Text>
                        </View>
                        <View className="flex-row justify-between items-center mb-2">
                          <Text className="flex-1 text-left text-[13px]">CGST ({rate}%):</Text>
                          <Text className="w-20 text-right text-[13px]">{(totalTax / 2).toFixed(2)}</Text>
                        </View>
                      </View>
                    ) : (
                      <View className="flex-row justify-between items-center mb-2">
                        <Text className="flex-1 text-left text-[13px]">IGST ({rate}%):</Text>
                        <Text className="w-20 text-right text-[13px]">{totalTax.toFixed(2)}</Text>
                      </View>
                    )}
                  </View>
                ))}

                <View className="flex-row justify-between items-center mb-2">
                  <Text className="flex-1 text-left font-bold text-[13px]">Total Amount :</Text>
                  <Text className=" w-20 text-right  font-bold text-[13px]">{(subTotal + allTaxTotal).toFixed(2)}</Text>
                </View>
              </View>
            </View>

            {/* Amount in Words */}
            <View className="p-4 border-b border-gray-200">
              <Text className="font-bold">Amount In Words</Text>
              <Text>{numberToWords(Number(subTotal) + Number(allTaxTotal) || 0)}</Text>

            </View>

            {/* Declaration and Bank Details */}
            <View className="flex-row border-b border-gray-200">
              <View className="w-1/2 p-4 border-r border-gray-200">
                <Text className="font-bold mb-1">Declaration:</Text>
                <Text className="text-sm">{invoiceData.declaration}</Text>
              </View>
              <View className="w-1/2 p-4">
                <Text className="font-bold mb-1">Company's Bank Details:</Text>
                <Text className="text-sm">Account Holders Name : {orgData.businessName}</Text>
                <Text className="text-sm">Bank Name : {orgData.businessName}</Text>
                <Text className="text-sm">A/c No : {orgData.accountNumber ? orgData.accountNumber : "--"}</Text>
                <Text className="text-sm">IFSC Code : {orgData.ifscCode ? orgData.ifscCode : "--"}</Text>
                <Text className="text-sm">Branch : {orgData.city}</Text>
              </View>
            </View>

            {/* Signatures */}
            <View className="flex-row border-b border-gray-200">
              <View className="w-1/2 p-4 border-r border-gray-200 h-24">
                <Text>Customer Signature and Seal</Text>
              </View>
              <View className="w-1/2 p-4 ">
                {/* <Text className="text-right">For {invoiceData.company.name}</Text> */}
                <Text className="text-right mt-12">Authorized Signature</Text>
              </View>
            </View>

            {/* Footer */}
            <View className="p-2 bg-gray-50">
              <Text className="text-center text-xs text-gray-500">Powered By Portstay</Text>
            </View>
          </View>
        </ScrollView>
      )
      }
    </View >
  );
};

export default ProformaInvoiceDetails;