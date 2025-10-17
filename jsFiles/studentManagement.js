// Function to load students for the instructor
async function loadStudents() {
    try {
        // Show loading state
        const studentList = document.getElementById('studentList');
        if (studentList) {
            studentList.innerHTML = '<tr><td colspan="4" class="text-center py-4">Loading students...</td></tr>';
        }

        // Get the current user (instructor)
        const user = auth.currentUser;
        if (!user) {
            window.location.href = '/htmlFiles/Welcome/signin.html';
            return;
        }

        // Get the instructor's document from Firestore
        const instructorRef = doc(db, 'instructors', user.uid);
        const instructorDoc = await getDoc(instructorRef);

        if (!instructorDoc.exists()) {
            console.error('Instructor not found');
            if (studentList) {
                studentList.innerHTML = '<tr><td colspan="4" class="text-center py-4 text-red-500">Error: Instructor profile not found</td></tr>';
            }
            return;
        }

        const instructorData = instructorDoc.data();
        const classId = instructorData.classId; // Assuming the instructor has a classId field

        if (!classId) {
            console.error('No class assigned to instructor');
            if (studentList) {
                studentList.innerHTML = '<tr><td colspan="4" class="text-center py-4">No class assigned to you yet.</td></tr>';
            }
            return;
        }

        // Get all students in the class
        const studentsQuery = query(collection(db, 'users'), where('classId', '==', classId), where('role', '==', 'student'));
        const querySnapshot = await getDocs(studentsQuery);

        if (querySnapshot.empty) {
            console.log('No students found in this class');
            if (studentList) {
                studentList.innerHTML = '<tr><td colspan="4" class="text-center py-4">No students found in your class.</td></tr>';
            }
            return;
        }

        // Clear loading message
        if (studentList) {
            studentList.innerHTML = '';
        }

        // Display students in the table
        querySnapshot.forEach((doc) => {
            const studentData = doc.data();
            const studentRow = `
                <tr class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center">
                            <div class="flex-shrink-0 h-10 w-10">
                                <span class="inline-flex items-center justify-center h-10 w-10 rounded-full bg-gray-200">
                                    <span class="text-gray-600">${studentData.displayName ? studentData.displayName.charAt(0).toUpperCase() : 'U'}</span>
                                </span>
                            </div>
                            <div class="ml-4">
                                <div class="text-sm font-medium text-gray-900">${studentData.displayName || 'No Name'}</div>
                                <div class="text-sm text-gray-500">${studentData.email || ''}</div>
                            </div>
                        </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-900">${studentData.grade || 'N/A'}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Active
                        </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <a href="student-details.html?id=${doc.id}" class="text-indigo-600 hover:text-indigo-900">View</a>
                    </td>
                </tr>
            `;
            if (studentList) {
                studentList.insertAdjacentHTML('beforeend', studentRow);
            }
        });
    } catch (error) {
        console.error('Error loading students:', error);
        const studentList = document.getElementById('studentList');
        if (studentList) {
            studentList.innerHTML = `
                <tr>
                    <td colspan="4" class="text-center py-4 text-red-500">
                        Error loading students. Please try again later.
                    </td>
                </tr>`;
        }
    }
}

// Initialize Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { 
    getAuth, 
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { 
    getFirestore, 
    doc, 
    getDoc, 
    collection, 
    query, 
    where, 
    getDocs 
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB8ouWfnnQ3YkpvRl65BZzjdwITHLLhhtc",
    authDomain: "ecolearn-7152f.firebaseapp.com",
    projectId: "ecolearn-7152f",
    storageBucket: "ecolearn-7152f.firebasestorage.app",
    messagingSenderId: "656526494781",
    appId: "1:656526494781:web:e49084105be0db03102e54",
    measurementId: "G-JS5675TB3K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Check authentication state and load students when authenticated
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in, load students
        loadStudents();
    } else {
        // User is signed out, redirect to login
        window.location.href = '/htmlFiles/Welcome/signin.html';
    }
});
