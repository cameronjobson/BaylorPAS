import React, { useState } from 'react';
import './App.css';

function NeoTool() {
  const [gestAgeWeeks, setGestAgeWeeks] = useState('');
  const [gestAgeDays, setGestAgeDays] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [birthWeight, setBirthWeight] = useState('');
  const [output, setOutput] = useState([]);

  // Convert specfic inputs from strings to integers
  const gestAgeTotalDays =
    (gestAgeWeeks ? parseInt(gestAgeWeeks, 10) * 7 : 0) +
    (gestAgeDays ? parseInt(gestAgeDays, 10) : 0);

  // Generate past dates in red, current dates in green
  const getDateClass = (date) => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Normalize current date to start of day for comparison
    const comparisonDate = new Date(date);
    comparisonDate.setHours(0, 0, 0, 0); // Normalize the comparison date

    if (comparisonDate < currentDate) {
      return 'past-date';
    } else if (comparisonDate.getTime() === currentDate.getTime()) {
      return 'current-date';
    } else {
      return '';
    }
  };

  const formatDate = (date) => {
    // Ensure we're formatting the date as UTC to avoid timezone conversions
    return new Date(date.getTime() + (date.getTimezoneOffset() * 60000))
      .toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
  };


  const calculateTreatmentDate = (dateOfBirth, daysOffset) => {
    // Parse the date as UTC
    const dob = new Date(new Date(dateOfBirth).toISOString());
    // Set the UTC date plus the day offset
    dob.setUTCDate(dob.getUTCDate() + daysOffset);
    // Format the date as a string in the local timezone
    return formatDate(dob);
  };
  

  //For treatment dates determined by gestagational age
  const traditionalTreatmentDate = (treatmentDescription, CGA) => {
    if (!dateOfBirth) return '';
    const dob = new Date(dateOfBirth);
    const treatmentDate = new Date(
      dob.getTime() +
      CGA * 7 * 24 * 60 * 60 * 1000 -
      gestAgeTotalDays * 24 * 60 * 60 * 1000
    );
    return {
      description: `${treatmentDescription} ${formatDate(treatmentDate)}`,
      date: formatDate(treatmentDate),
    };
  };

  //Calculate ROP Dates
  const calculateRopExamDate = () => {
    if (gestAgeTotalDays >= 0 && gestAgeTotalDays < 161){
      return traditionalTreatmentDate("ROP First Exam Due near week of:", 31)
    } else if (gestAgeTotalDays >= 161 && gestAgeTotalDays < 168){
      return traditionalTreatmentDate("ROP First Exam Due near week of:", 31)
    } else if (gestAgeTotalDays >= 168 && gestAgeTotalDays < 175){
      return traditionalTreatmentDate("ROP First Exam Due near week of:", 31)
    } else if (gestAgeTotalDays >= 175 && gestAgeTotalDays < 182){
      return traditionalTreatmentDate("ROP First Exam Due near week of:", 31)
    } else if (gestAgeTotalDays >= 182 && gestAgeTotalDays < 189){
      return traditionalTreatmentDate("ROP First Exam Due near week of:", 31)
    } else if (gestAgeTotalDays >= 189 && gestAgeTotalDays < 196){
      return traditionalTreatmentDate("ROP First Exam Due near week of:", 31)
    } else if (gestAgeTotalDays >= 196 && gestAgeTotalDays < 203){
      return traditionalTreatmentDate("ROP First Exam Due near week of:", 32)
    } else if (gestAgeTotalDays >= 203 && gestAgeTotalDays < 210){
      return traditionalTreatmentDate("ROP First Exam Due near week of:", 33)
    } else if (gestAgeTotalDays >= 210 && gestAgeTotalDays < 217){
      return traditionalTreatmentDate("ROP First Exam Due near week of:", 34)
    } else if (gestAgeTotalDays >= 217 && gestAgeTotalDays < 224){
      return traditionalTreatmentDate("ROP First Exam Due near week of:", 35)
    } else if (gestAgeTotalDays >= 224 && gestAgeTotalDays < 231){
      return traditionalTreatmentDate("ROP First Exam Due near week of:", 36)
    } else if (gestAgeTotalDays >= 231 && gestAgeTotalDays < 238){
      return traditionalTreatmentDate("ROP First Exam Due near week of:", 37)
    } else if (gestAgeTotalDays >= 238 && gestAgeTotalDays < 245){
      return traditionalTreatmentDate("ROP First Exam Due near week of:", 38)
    } else if (gestAgeTotalDays >= 245 && gestAgeTotalDays < 252){
      return traditionalTreatmentDate("ROP First Exam Due near week of:", 39)
    } else {
      return traditionalTreatmentDate("ROP First Exam Due near week of:", 40)
  }}

  // For treatment dates determined by Days Of Life
  const simpleTreatment = (treatmentDescription, daysAdd) => {
    if (!dateOfBirth) return '';
    return {
      description: `${treatmentDescription} ${calculateTreatmentDate(dateOfBirth, daysAdd)}`,
      date: calculateTreatmentDate(dateOfBirth, daysAdd),
    };
  };

  //List of protocals for generating treatment list
  const treatmentList = () => {
    let treatments = [];
    const weight = birthWeight ? parseInt(birthWeight, 10) : 0;
    //Catch Invalid Inputs
    if (weight <= 0) treatments.push('Enter a valid Weight.');
    if (gestAgeTotalDays <= 0) treatments.push('Enter a valid Gestational Age.');
    if (dateOfBirth === '') treatments.push('Enter a valid DOB');

    if (weight > 0 && gestAgeTotalDays > 0) {
      if (weight <= 1500){
        treatments.push(traditionalTreatmentDate('DEBM stop at 1500g and 35w', 35));
      }
      treatments.push(simpleTreatment('MVI/Fe at full feeds and >/=14dol', 14));
      treatments.push(calculateRopExamDate())
    }

    return treatments;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setOutput(treatmentList());
  };

  return (
    <div className="NeoTool">
      <form onSubmit={handleSubmit}>
      <img src="/BSW_Baylor_University_Medical_Center_C_4C_White_Background__20210512_16553398_.jpg" alt="Baylor University Medical Center" />
        <h1>NICU Patient Treatment Generator</h1>
        <h2>(Baylor University Medical Center)</h2>
        <div className="input-group">
          <label htmlFor="gestational-age-weeks">Birth Gestational Age:</label>
          <input
            className="weeks-input"
            id="gestational-age-weeks"
            type="text"
            value={gestAgeWeeks}
            onChange={(e) => setGestAgeWeeks(e.target.value)}
            placeholder="Weeks"
          />
          <label className="label-inline" htmlFor="gestational-age-days">
            w
          </label>
          <input
            className="days-input"
            id="gestational-age-days"
            type="text"
            value={gestAgeDays}
            onChange={(e) => setGestAgeDays(e.target.value)}
            placeholder="Days"
          />
          <label className="label-inline">d</label>
        </div>

        <div className="input-group">
          <label htmlFor="dob">DOB:</label>
          <input
            id="dob"
            type="date"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label htmlFor="birth-weight">Birth weight:</label>
          <input
            className="weight-input"
            id="birth-weight"
            type="text"
            value={birthWeight}
            onChange={(e) => setBirthWeight(e.target.value)}
            placeholder="Grams"
          />
          <label className="label-inline">g</label>
        </div>

        <button type="submit">Generate Treatment Dates</button>
      </form>

      <div className="output-section">
        {output.map((item, index) => {
          const dateClass = getDateClass(item.date || '');
          return (
            <div key={index} className={dateClass}>
              {item.description || item}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default NeoTool;
