const express = require('express');
const cors = require("cors");
const { uuid, isUuid } = require ('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function logRequests(request, response, next) {
    const { method, url } = request;

    const logLabel = `[${method.toUpperCase()}] ${url}`;

    console.time(logLabel);

   next(); // Próximo Midlleware

   console.timeEnd(logLabel);
}
function validateProjectId(request, response, next){
    const { id } = request.params;

    if(!isUuid(id)) {
        return response.status(400).json({error: 'Invalid project ID.'});
    }
    
    return next();
} 

app.use(logRequests);

app.use('/repositories/:id', validateProjectId);

app.get('/repositories', (request, response) => {
    const { title } = request.query;

    const results = title
    ? repositories.filter(project => project.title.includes(title))
    : repositories;
    return response.json(results);

});
app.post('/repositories', (request, response) => {

    const { title, url, techs} = request.body;
    const likes = 0;

    const repositorie = {id: uuid(), title, url, techs, likes };
    repositories.push(repositorie);

    return response.json(repositorie);

});
app.post('/repositories/:id/like', (request, response) => {

    const { id } = request.params;

    const projectIndex = repositories.findIndex(repositorie => repositorie.id === id);

    if(projectIndex < 0){
        return response.status(400).json({error: 'repositorie not found'});
    }

    const likes = repositories[projectIndex].likes + 1;

    const repositorie = {
        ...repositories[projectIndex],
        likes,
    };
    
    repositories[projectIndex] = repositorie;
    
    return response.json(repositorie);

});
app.put('/repositories/:id', (request, response) => {

    const { id } = request.params;
    const { title, url, techs} = request.body;

    const projectIndex = repositories.findIndex(repositorie => repositorie.id === id);

    if(projectIndex < 0){
        return response.status(400).json({error: 'repositorie not found'});
    }

    const repositorie = {
        id,
        title,
        url,
        techs,
    };
    repositories[projectIndex] = repositorie;
    
    return response.json(repositorie);
});
app.delete('/repositories/:id', (request, response) => {
    const { id } = request.params;
    const projectIndex = repositories.findIndex(repositorie => repositorie.id === id);

    if(projectIndex < 0){
        return response.status(400).json({error: 'Project not found'});
    }
    repositories.splice(projectIndex, 1);
    
    return response.status(204).send();
});
app.listen(3333, () =>{
    console.log('❤🚀Backend Started!');
});


