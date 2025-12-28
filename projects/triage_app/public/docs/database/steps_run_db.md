## Steps on how to run database


1. Open a terminal
2. set directory to server folder
3. run node createSchema.js
4. run createTables.js
5. run server.js
6. leave this terminal open and running, and then open up a new terminal
7. from that terminal, change directory to seed_queries

8. The next step is to run createView based on your needs/circumstances. One version of the sql script will calculate estimated wait time based on the current time. If the triage dates for the patients is 
far off from those times, the numbers will be very large. IF you want to customize the times, then run the one that uses reference_time, and set the time you want.
9. Once you are done that, run seed_queries_triage.js to create the records for the 5 triage levels.
10. NOTE: If you don't want to manually put in your own records, then you're done. the server is ready to accept requests from the API and insert data into the db from there.

11. If you do want to add in some of your own pre-set data, like patient information, then stay in seed_queries directory and run seed_queries_patient and/or seed_queries_tracker
12. Aside from the pre-set data in seed_queries, there is also a text file that contains additional sql script to help customize the dataset, including update statements to change patients triage status.
12. After that you are done. You are connected and your data is setup. Just make to sure to keep the terminal that is running server.js open  