// Convert Gregorian to Jalali and Hijri
function convertGregorian(dateStr) {
    const [year, month, day] = dateStr.split('-').map(Number);
    if (!isValidDate(year, month, day)) return showError("Invalid Gregorian Date");

    // Convert to Jalali
    const jalali = gregorian_to_jalali(year, month, day);
    document.getElementById('jalali').value = `${jalali[0]}/${pad(jalali[1])}/${pad(jalali[2])}`;

    // Convert to Hijri
    const hijri = gregorianToHijri(year, month, day);
    document.getElementById('hijri').value = `${hijri.year}/${pad(hijri.month)}/${pad(hijri.day)}`;
  }

  // Convert Jalali to others
  function convertJalali(dateStr) {
    const [jy, jm, jd] = dateStr.split('/').map(Number);
    if (!isValidJalali(jy, jm, jd)) return showError("Invalid Jalali Date");

    // Convert to Gregorian
    const greg = jalali_to_gregorian(jy, jm, jd);
    document.getElementById('gregorian').value = `${greg[0]}-${pad(greg[1])}-${pad(greg[2])}`;

    // Convert to Hijri
    const hijri = gregorianToHijri(greg[0], greg[1], greg[2]);
    document.getElementById('hijri').value = `${hijri.year}/${pad(hijri.month)}/${pad(hijri.day)}`;
  }

  // Convert Hijri to others
  function convertHijri(dateStr) {
    const [hy, hm, hd] = dateStr.split('/').map(Number);
    if (!isValidHijri(hy, hm, hd)) return showError("Invalid Hijri Date");

    // Convert to Gregorian
    const greg = hijriToGregorian(hy, hm, hd);
    document.getElementById('gregorian').value = `${greg.year}-${pad(greg.month)}-${pad(greg.day)}`;

    // Convert to Jalali
    const jalali = gregorian_to_jalali(greg.year, greg.month, greg.day);
    document.getElementById('jalali').value = `${jalali[0]}/${pad(jalali[1])}/${pad(jalali[2])}`;
  }

  // Helper: Pad numbers
  function pad(n) {
    return n < 10 ? '0' + n : n;
  }

  // Set today's date
  function setToday() {
    const today = new Date();
    const year = today.getFullYear();
    const month = pad(today.getMonth() + 1);
    const day = pad(today.getDate());
    document.getElementById('gregorian').value = `${year}-${month}-${day}`;
    convertGregorian(`${year}-${month}-${day}`);
  }

  // Copy to clipboard
  function copyToClipboard(id) {
    const input = document.getElementById(id);
    input.select();
    document.execCommand('copy');
    alert(`Copied: ${input.value}`);
  }

  // Show error message
  function showError(msg) {
    const el = document.getElementById('error');
    el.textContent = msg;
    el.classList.remove('hidden');
    setTimeout(() => el.classList.add('hidden'), 3000);
  }

  // Validate Gregorian date
  function isValidDate(y, m, d) {
    const date = new Date(y, m - 1, d);
    return date.getFullYear() === y && date.getMonth() + 1 === m && date.getDate() === d;
  }

  // Validate Jalali date
  function isValidJalali(y, m, d) {
    return y >= -61 && y <= 3177 && m >= 1 && m <= 12 && d >= 1 && d <= (m <= 6 ? 31 : m <= 11 ? 30 : (isJalaliLeapYear(y) ? 30 : 29));
  }

  // Validate Hijri date
  function isValidHijri(y, m, d) {
    return y >= 1 && m >= 1 && m <= 12 && d >= 1 && d <= 30;
  }

  // Leap year for Jalali
  function isJalaliLeapYear(y) {
    const a = [0, 1, 4, 5, 8, 9, 12, 13, 16, 17, 20, 21, 24, 25, 28, 29];
    return a.includes((y + 11) % 33);
  }

  // Event Listeners
  document.getElementById('gregorian').addEventListener('input', e => convertGregorian(e.target.value));
  document.getElementById('jalali').addEventListener('input', e => convertJalali(e.target.value));
  document.getElementById('hijri').addEventListener('input', e => convertHijri(e.target.value));

  // Jalali conversion
  function gregorian_to_jalali(gy, gm, gd) {
    let g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
    gy -= 621; let gy2 = gy + 38; let leap1 = Math.floor((gy2 / 33)) * 5 + Math.floor(((gy2 % 33) * 4 + 14) / 32) - Math.floor((gy2 % 33) / 32); let leap2 = Math.floor((gy / 33)) * 5 + Math.floor(((gy % 33) * 4 + 14) / 32) - Math.floor((gy % 33) / 32);
    let march = (((gy * 0.24219858156028415) + 79.39407833333333) - ((gy - 1) * 0.24219858156028415) + 0.5) | 0;
    let gyd = g_d_m[gm - 1] + gd + ((!(gy % 4) && gy !== 0) ? 1 : 0); let jyd = gyd - march; let jleap = 0;
    if (jyd < 1) { gy--; jyd += (((gy % 4) === 3 || (!(gy % 4) && gy !== 0)) ? 366 : 365); } else { if (jyd > (365 + leap2)) { gy++; jyd -= (365 + leap1); } }
    let jy = gy + 621; let jm = (jyd <= 186) ? ((jyd - 1) / 31) | 0 + 1 : ((jyd - 187) / 30) | 0 + 7; let jd = (jyd <= 186) ? ((jyd - 1) % 31) + 1 : ((jyd - 187) % 30) + 1;
    return [jy, jm, jd];
  }

  function jalali_to_gregorian(jy, jm, jd) {
    let gy = jy - 621; let gyd = ((jm <= 7) ? ((jm - 1) * 31) + jd : ((jm - 7) * 30) + jd + 186); let leap = Math.floor((gy / 33)) * 5 + Math.floor(((gy % 33) * 4 + 14) / 32) - Math.floor((gy % 33) / 32);
    if (gyd > (365 + leap)) { gy++; gyd -= (365 + leap); } let g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334]; let leap_g = (!(gy % 4) && gy !== 0) ? 1 : 0;
    let i = 11; while (g_d_m[i] + leap_g < gyd) i++; let gm = i; gyd -= g_d_m[i]; if (i > 1 && leap_g) gyd--;
    return [gy + 621, gm + 1, gyd + 1];
  }

  // Hijri to Gregorian (simplified)
  function hijriToGregorian(iy, im, id) {
    let jd = (1948440 + (354 * iy) + Math.floor((3 + (11 * iy)) / 30) + (29 * im) + Math.floor((im - 1) / 2) + id - 1);
    let l = jd + 68569; let n = Math.floor((4 * l) / 146097); l = l - Math.floor((146097 * n + 3) / 4); let i = Math.floor((4000 * (l + 1)) / 1461001);
    l = l - Math.floor((1461 * i) / 4) + 31; let j = Math.floor((80 * l) / 2447); let d = l - Math.floor((2447 * j) / 80); l = Math.floor(j / 11);
    j = j + 2 - 12 * l; let y = 100 * (n - 49) + i + l;
    return { year: y, month: j, day: d };
  }

  function gregorianToHijri(y, m, d) {
    let jd = gregorianToJulian(y, m, d);
    let iyd = jd - 1948440;
    let iy = Math.floor((30 * iyd + 10646) / 10631);
    let im = Math.floor((iyd - 29.5001 * iy - 0.0095) / -29.5) + 1;
    let id = iyd - Math.floor((11 * iy + 3) / 30) - 29 * iy + 1;
    return { year: iy, month: im, day: id };
  }

  function gregorianToJulian(y, m, d) {
    if (m < 3) { y--; m += 12; }
    let a = Math.floor(y / 100); a = 2 - a + Math.floor(a / 4);
    let b = Math.floor(365.25 * (y + 4716)); let c = Math.floor(30.6001 * (m + 1));
    return b + c + d + 59 - 1524.5;
  }