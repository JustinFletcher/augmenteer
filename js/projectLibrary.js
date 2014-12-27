/**
 * Created by Justin Fletcher on 12/27/2014.
 */

function addNewProject() {
    // This function must create a new div of height and width 0px
    // The div must expand to fit it's contents automatically.
    // projects will always reside on the taskField (projectField?) so explicit addressing isn't needed
    // The project should have data, including some meta-data about itself, and a full list of it's tasks.
    // With projects we introduce the idea of completion. This should be captured by the div in some way.

    var $newProject = $('<div class="project-holder"><div class="project-task-field"></div></div>');
    $('#projectField').append($newProject);
    //offset$ElementPosition($newProject, Math.random()*400, 50);
    return $newProject;
}


jQuery.fn.extend({
    addUnlinkedTask: function(taskData)
    {

        var $project = $(this);
        var $newTaskHolder = createTaskHolder(taskData.taskTitle);

        // Add the newTaskHolder to it's field, by way of append
        $project.children('.project-task-field').append($newTaskHolder);

        // Trigger the append event. I'm not sure why.
        // TODO: check why we're triggering append here...
        $newTaskHolder.trigger('append');

        // Position the new task inside it's project.
        // This needs to become an algorithm. Find the lowest task in the project, place this new one below it, at the left.
        offset$ElementPosition($newTaskHolder, 50, 50);
    }
});
