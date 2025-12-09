Prerequisites

Assumption is AWS MySQL RDS database with ksuassignment3 schema is available.

To setup the database, the script is available in the database setup folder
/setupscript/setupdatabase.txt
databasehostname: database-1.cfwyuaeieyln.us-east-2.rds.amazonaws.com
database identifier: database-1

Assumption is AWS EC2 Windows instance is available

To setup the AWS EC2 instance, the below details are the once I have used
public dns: ec2-18-119-175-34.us-east-2.compute.amazonaws.com
instance id: i-074d7ee87c2d165ae

The application is downloaded from the the GitHub

the assumption the python, npm server, Django libraries installed
start the backend server
cd c:\projectweb
cd c:\backend

start the React from application
npm run build
npx serve -s dist -l 3000
http://localhost:3000/
