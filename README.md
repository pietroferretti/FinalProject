#README

Thank you very much for reviewing our project.

The final report is directly under folder "FinalProject", named "final_report.pdf". It can also be reached from link: https://github.com/PietroFerretti/FinalProject/blob/master/final_report.pdf 

A screencast of the application is on: https://vimeo.com/143414010

OUR CONFESS:
We had great projects for our application, but due to time constraints and more importantly because of our lack of skill and experience in web programming (neither of us ever actually learnt javascript or html), the application is far from completed.
This is what is missing and we would have implemented if we had more time:
- a page to search for genes and diseases related by the same genes. In the code we left a draft (annotation formatted), but it's not working yet;
- a filter for unsafe drugs;
- some graphic design and a better formatting;
- a description for every interaction (not in our ontology so we would have used an external SPARQL endpoint dynamically);
- and more.

We're still learning but we did our best.

Quick checklist on how to run the application:
* `stardog-admin server start --disable-security` (the application assumes a database called "interdrugs")
* `virtualenv .` in the repository directory
* `source bin/activate` 
* `cd src`
* `python server.py`
