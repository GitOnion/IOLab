$(document).ready(
    function(){
    // Add the todo item to the left column - #todo1
    $("#submitButton").on("click", function(){
      $("#todo1").prepend("<table class=item><td class=taskCheck><input type=checkbox></td><td class=task><p class='test'>"+ document.getElementById('textInput').value + "</p></td></table>");
    });
    // Attach the changelist function to all children elements of the "#todo1" div
    $("#todo1").on("change", ".taskCheck", function(){
      changeList(this, "todo");
    });
    // Attach the changelist function to all children elements of the "#complete1" div
    $("#complete1").on("change", ".taskCheck", function(){
      changeList(this, "complete");
    });
});
function changeList(element, flag){
    //Store the item and remove it, then prepend to the new list depending on the caller's flag.
    var target = $(element).parent();
    $(target).remove();
    if (flag === "todo"){
      $("#complete1").prepend(target);
    }
    else{
      $("#todo1").prepend(target);
    }
    setTimeout(function(){
      element.childNodes[0].checked = false;
    }, 300);
}
