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

    // Overwrite the native jQuery append function for $newProject
    (function($) {
        var origAppend = $.fn.append;
        $.fn.append = function () {
            return origAppend.apply(this, arguments).trigger("append");
        };
    })(jQuery);

    $newProject.bind("append", function() {
        var $projectHolder = $(this);
        var $taskHolders = $projectHolder.children('.project-task-field').children();
        var lowestTop = 0;
        $taskHolders.each(
            function () {
                var $childTask = $(this);
                var thisChildTop = $childTask.timeInvariantPositionTop();
                thisChildTop = (thisChildTop != 'undefined')?(thisChildTop):(0);
                lowestTop = (thisChildTop > lowestTop)?(thisChildTop):(lowestTop);
            }

        );
        var taskHolderFloor = lowestTop + $taskHolders.first().height() + 50;
        if ($projectHolder.height() < taskHolderFloor) {
            $projectHolder.height(taskHolderFloor);
            $projectHolder.animate(
                {
                    height : taskHolderFloor + 'px'
                },
                125);
        }
    });

    return $newProject;
}


jQuery.fn.extend({
    //...ToProject
    addUnlinkedTask: function(taskData)
    {

        var $projectHolder = $(this);
        var $newTaskHolder = createTaskHolder(taskData.taskTitle);

        // Add the newTaskHolder to it's field, by way of append
        $projectHolder.children('.project-task-field').append($newTaskHolder);

        // Trigger the append event. I'm not sure why.
        // TODO: check why we're triggering append here...
        $newTaskHolder.trigger('append');

        // Position the new task inside it's project.
        // This needs to become an algorithm. Find the lowest task in the project, place this new one below it, at the left.
        var taskTop = 50;
        offset$ElementPosition($newTaskHolder, taskTop, 50);

    }
});
