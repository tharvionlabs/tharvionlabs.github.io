function formatMoney(n){
  if(!isFinite(n)) return "-";
  return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function calcEMI(principal, annualRate, months){
  const r = (annualRate/100)/12;
  if(months <= 0) return { emi: 0, totalPay: 0, totalInterest: 0 };
  if(r === 0){
    const emi = principal / months;
    return { emi, totalPay: emi*months, totalInterest: 0 };
  }
  const emi = principal * r * Math.pow(1+r, months) / (Math.pow(1+r, months) - 1);
  const totalPay = emi * months;
  const totalInterest = totalPay - principal;
  return { emi, totalPay, totalInterest };
}

document.addEventListener("DOMContentLoaded", ()=>{
  const form = document.getElementById("emiForm");
  if(!form) return;

  const outEmi = document.getElementById("outEmi");
  const outPay = document.getElementById("outPay");
  const outInt = document.getElementById("outInt");

  function run(){
    const P = Number(document.getElementById("loanAmount").value || 0);
    const R = Number(document.getElementById("interestRate").value || 0);
    const M = Number(document.getElementById("loanMonths").value || 0);

    const res = calcEMI(P, R, M);
    outEmi.textContent = "LKR " + formatMoney(res.emi);
    outPay.textContent = "LKR " + formatMoney(res.totalPay);
    outInt.textContent = "LKR " + formatMoney(res.totalInterest);
  }

  form.addEventListener("submit", (e)=>{ e.preventDefault(); run(); });
  ["loanAmount","interestRate","loanMonths"].forEach(id=>{
    document.getElementById(id).addEventListener("input", run);
  });

  run();
});
