cyberattackmap
  - Description
      - cyberattackmap is a django based web application that visualizes simulated cyber attacks that happen in the real world.

Features
  1. Simulated real-time visualization of cyber attacks.

  2. Focuses on the major attack types that have readily available information on them.

  3. Simulates attacks at 2 attacks per second.

  4. Color coded pings based on what attack is displayed.

  5. Interactive map that has zoom and move features.

  6. Dasboard that shows attack statistics, like most attacked country, Total attack number, etc.

  7. Recent attacks panel that shows the attack and its severity level.

  8. Filter implementation allows for users to filter attacks and severity types that display on the recent attacks panel.

Usage
- How to Start the cyberattackmap Project

BACKEND
1. Clone the repository and navigate to project folder:
   -     clone <repo_url>
   -     cd cyberattackmap
   
2. Set up a Virtual Environment using:
   -     python3 -m venv .venv
   -     source "virtualenvironmentName"/bin/activate
   
3. Install dependencies using:
   - If you are using UV:
   -     uv sync
   -   Oherwise:
   -     pip install

4. Run Migrations:
   -      python3 manage.py migrate

5. Start the Backend Server:
   -     python3 manage.py runserver

6. Now you can see cyber attacks happening in a simulated real time project.
   

CONTACT:

Grant Wells
gswells0206@gmail.com


   
   
   

