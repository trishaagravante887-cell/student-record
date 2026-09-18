import students from './students.json' assert { type: 'json' };

// ==========================================
// UTILITY & REQUIRED FUNCTIONS
// ==========================================

function getAverageGrade(student) {
  if (!student || !Array.isArray(student.grades) || student.grades.length === 0) {
    return 0;
  }
  const sum = student.grades.reduce((acc, grade) => acc + grade, 0);
  return Number((sum / student.grades.length).toFixed(2));
}

function getTopStudents(studentsArr, n) {
  if (!Array.isArray(studentsArr)) throw new TypeError("Expected an array of students.");
  if (typeof n !== "number" || n < 0) throw new Error("Count 'n' must be a non-negative number.");

  return [...studentsArr]
    .map(s => ({ ...s, averageGrade: getAverageGrade(s) }))
    .sort((a, b) => b.averageGrade - a.averageGrade)
    .slice(0, n);
}

function groupByCourse(studentsArr) {
  if (!Array.isArray(studentsArr)) throw new TypeError("Expected an array of students.");

  return studentsArr.reduce((acc, s) => {
    const courseKey = s.course || "Unassigned";
    if (!acc[courseKey]) acc[courseKey] = [];
    acc[courseKey].push({ ...s });
    return acc;
  }, {});
}

function getEnrolledCount(studentsArr) {
  if (!Array.isArray(studentsArr)) throw new TypeError("Expected an array of students.");

  return studentsArr.reduce((acc, s) => {
    if (s.enrolled) acc.enrolled++;
    else acc.notEnrolled++;
    return acc;
  }, { enrolled: 0, notEnrolled: 0 });
}

function findStudent(studentsArr, name) {
  if (!Array.isArray(studentsArr)) throw new TypeError("Expected an array of students.");
  if (typeof name !== "string") throw new TypeError("Name query must be a string.");

  const searchStr = name.trim().toLowerCase();
  const match = studentsArr.filter(s => s.name.toLowerCase() === searchStr);
  return match.length > 0 ? { ...match[0] } : null;
}

function getCourseAverages(studentsArr) {
  if (!Array.isArray(studentsArr)) throw new TypeError("Expected an array of students.");
  if (studentsArr.length === 0) return [];

  const grouped = groupByCourse(studentsArr);

  return Object.keys(grouped)
    .map(course => {
      const courseStudents = grouped[course];
      const valid = courseStudents.filter(s => s.grades && s.grades.length > 0);
      const avg = valid.length > 0
        ? valid.reduce((sum, s) => sum + getAverageGrade(s), 0) / valid.length
        : 0;
      return { course, averageGrade: Number(avg.toFixed(2)) };
    })
    .sort((a, b) => b.averageGrade - a.averageGrade);
}

function exportSummary(studentsArr) {
  if (!Array.isArray(studentsArr)) throw new TypeError("Expected an array of students.");

  if (studentsArr.length === 0) {
    return {
      totalStudents: 0,
      overallAverageGrade: 0,
      topStudent: null,
      courseBreakdown: []
    };
  }

  const validStudents = studentsArr.filter(s => s.grades && s.grades.length > 0);
  const overallAvg = validStudents.length > 0
    ? validStudents.reduce((sum, s) => sum + getAverageGrade(s), 0) / validStudents.length
    : 0;

  const top = getTopStudents(studentsArr, 1)[0] || null;

  return {
    totalStudents: studentsArr.length,
    overallAverageGrade: Number(overallAvg.toFixed(2)),
    topStudent: top ? { name: top.name, averageGrade: top.averageGrade } : null,
    courseBreakdown: getCourseAverages(studentsArr)
  };
}

// ==========================================
// STRETCH GOALS
// ==========================================

function filterByYear(studentsArr, year) {
  if (!Array.isArray(studentsArr)) throw new TypeError("Expected an array of students.");
  if (typeof year !== "number" || year <= 0) throw new Error("Year must be a positive integer.");

  return studentsArr.filter(s => s.year === year);
}

function sortByName(studentsArr) {
  if (!Array.isArray(studentsArr)) throw new TypeError("Expected an array of students.");

  return [...studentsArr].sort((a, b) => a.name.localeCompare(b.name));
}

// ==========================================
// MAIN EXECUTION
// ==========================================

function main() {
  console.log("=========================================");
  console.log("      STUDENT RECORDS ANALYSIS REPORT    ");
  console.log("=========================================\n");

  const enrollment = getEnrolledCount(students);
  console.log("--- 1. ENROLLMENT SUMMARY ---");
  console.log(`Enrolled:     ${enrollment.enrolled}`);
  console.log(`Not Enrolled: ${enrollment.notEnrolled}\n`);

  console.log("--- 2. TOP 3 PERFORMING STUDENTS ---");
  getTopStudents(students, 3).forEach((s, idx) => {
    console.log(`${idx + 1}. ${s.name} (${s.course}) - Avg: ${s.averageGrade}`);
  });
  console.log("");

  console.log("--- 3. COURSE PERFORMANCE ---");
  getCourseAverages(students).forEach(c => {
    console.log(`- ${c.course}: ${c.averageGrade}`);
  });
  console.log("");

  console.log("--- 4. SEARCH DEMO ---");
  const found = findStudent(students, "alice johnson");
  console.log(`Search 'alice johnson':`, found ? `${found.name} (${found.course})` : "Not Found");
  console.log("");

  console.log("--- 5. STRETCH GOALS DEMO ---");
  console.log(`Year 1 Students Count: ${filterByYear(students, 1).length}`);
  console.log(`First Student Alphabetically: ${sortByName(students)[0].name}\n`);

  console.log("--- 6. EXPORTED SUMMARY OBJECT ---");
  console.log(JSON.stringify(exportSummary(students), null, 2));
  console.log("\n=========================================");
}

main();