// File: Code.gs (Updated for Single-Page Application)
// AI by A: Backend script for Uthai Hospital's Carbon Footprint Data Collector

const SHEET_ID = "17mCv54VhNlYh-N215TAnahll1trbKfy5Q0m_z7gVssA";
const SHEET_NAME = "ฐานข้อมูล Carbon Footprint รพ.อุทัย"; 

/**
 * Main function to serve the single-page web app.
 * It will always render the 'application.html' file.
 */
function doGet(e) {
  return HtmlService.createTemplateFromFile('application') 
    .evaluate() 
    .setTitle("Carbon Footprint | รพ.อุทัย")
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Saves form data to the specified Google Sheet.
 * This function is called from the client-side JavaScript.
 */
function saveData(data) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME);
    
    const timestamp = new Date();
    const dataDate = data.dataDate;
    const department = data.department;

    if (data.electricity > 0) sheet.appendRow([timestamp, dataDate, department, "การใช้ไฟฟ้า", data.electricity, "kWh"]);
    if (data.water > 0) sheet.appendRow([timestamp, dataDate, department, "การใช้น้ำประปาส่วนภูมิภาค", data.water, "ลูกบาศก์เมตร"]);
    if (data.paper > 0) sheet.appendRow([timestamp, dataDate, department, "การใช้กระดาษ A4", data.paper, "รีม"]);
    if (data.infectiousWaste > 0) sheet.appendRow([timestamp, dataDate, department, "ขยะติดเชื้อ", data.infectiousWaste, "กิโลกรัม"]);
    if (data.generalWaste > 0) sheet.appendRow([timestamp, dataDate, department, "ขยะทั่วไป", data.generalWaste, "กิโลกรัม"]);
    if (data.organicWaste > 0) sheet.appendRow([timestamp, dataDate, department, "ขยะอินทรีย์", data.organicWaste, "กิโลกรัม"]);
    if (data.dieselVehicle > 0) sheet.appendRow([timestamp, dataDate, department, "การใช้น้ำมันดีเซลกับยานพาหนะ", data.dieselVehicle, "ลิตร"]);
    if (data.dieselMachine > 0) sheet.appendRow([timestamp, dataDate, department, "การใช้น้ำมันดีเซลกับเครื่องจักร", data.dieselMachine, "ลิตร"]);
    if (data.benzinVehicle > 0) sheet.appendRow([timestamp, dataDate, department, "การใช้น้ำมันเบนซินกับยานพาหนะ", data.benzinVehicle, "ลิตร"]);
    if (data.benzinMachine > 0) sheet.appendRow([timestamp, dataDate, department, "การใช้น้ำมันเบนซินกับเครื่องจักร", data.benzinMachine, "ลิตร"]);
    if (data.gasLpg > 0) sheet.appendRow([timestamp, dataDate, department, "การใช้ก๊าซหุงต้ม", data.gasLpg, "กิโลกรัม"]);

    return "ข้อมูลถูกบันทึกเรียบร้อยแล้ว";
  } catch (e) {
    console.error("saveData Error: " + e.toString());
    return "เกิดข้อผิดพลาดในการบันทึก: " + e.toString();
  }
}

/**
 * Fetches and formats all data from the Google Sheet for the dashboard.
 * This function is called from the client-side JavaScript.
 */
function getSheetData() {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      throw new Error("Sheet '" + SHEET_NAME + "' not found.");
    }
    
    if (sheet.getLastRow() < 2) return [];
    
    const dataRange = sheet.getRange(2, 1, sheet.getLastRow() - 1, 6);
    const data = dataRange.getValues();

    return data.map(row => {
      if (!row || row.length < 6) return null;
      if (row[1] instanceof Date) {
        row[1] = Utilities.formatDate(row[1], Session.getScriptTimeZone(), 'yyyy-MM-dd');
      }
      if (row[0] instanceof Date) {
        row[0] = row[0].toISOString();
      }
      return row;
    }).filter(row => row !== null);
  } catch (e) {
    console.error("getSheetData Error: " + e.toString());
    return { error: true, message: e.toString() };
  }
}

