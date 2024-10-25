Before launch of app you need to have "PgAdmin 4" installed and you also need to set database-related variables in index.js file at the very top.
# Launch of app in root directory
npm install -g nodemon \
npm install pg --save \
npm install express --save \
npm install html-pdf-node --save \
nodemon node-postgres/backend/index.js 
# In a new console enter
npm start 
