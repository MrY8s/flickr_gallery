// set variables

api_key = "2a8ba1d2202e70e0b596c1362da04aba"
thumbnail_size = "s" // small = s, medium = m, large = l
currentPage = 1
max_tags = 3

searchstring = ""



function getPhotos(searchstring, pagenumber) {

// run JSON query to get list of photos we are going to display (then get their details)
cxString = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key="+api_key+"&text="+searchstring+"&page="+pagenumber+"&per_page=4&safe_search=1&format=json&jsoncallback=?"

$.getJSON(cxString, function (data) {
    var list = $("<tr></tr>");
    $.each(data.photos.photo, function (i, set) {
        var id = set.id
        var lastpage = set.lastPage

        // run a second query to get individual photo info
        cxString2 = "https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key="+api_key+"&photo_id="+(id)+"&format=json&jsoncallback=?"
        $.getJSON(cxString2, function (data2) {
          
            var farm = data2.photo.farm
            var server = data2.photo.server
            var secret = data2.photo.secret
            var title = data2.photo.title._content
          
          // ensure title isn't too large
            if (title.length > 20) {

               title = title.substring(1, 20) + "...";

            }
            var author = data2.photo.owner.username
            var nsid = data2.photo.owner.nsid
            

            var description = data2.photo.description._content
            
            // need to limit description so it's not an essay!

            if (description.length > 100) {

               description = description.substring(1, 100) + "...";

            };

            if (description.length = 0) {
              description = description + "none";
            };

          // run a 3rd query to get tags info 
          cxStringTags = "https://api.flickr.com/services/rest/?method=flickr.tags.getListPhoto&api_key="+api_key+"&photo_id="+id+"&format=json&jsoncallback=?"

          $.getJSON(cxStringTags, function (data_tags) {
           var list_tags= "";
          count = 0;
          $.each(data_tags.photo.tags.tag, function (i, set) {
          var tag_content = set._content
        
          //append up to 3 tags (otherwise it becomes too big)
          if (count < max_tags) {
          list_tags += (tag_content+", ")};
          count += 1;
          });

          // tidy up tags string - remove extraaneous comma from end!
          last_comma = list_tags.lastIndexOf(", ");
          list_tags = list_tags.slice(0, last_comma);
          
          // build the html output to show the images and details
          $(list).append("<td><a href='https://flickr.com/"+nsid+"/"+id+"' target='new'><center><img src='https://farm" + farm + ".staticflickr.com/" + server + "/" +id+ "_" +secret + "_"+thumbnail_size+".jpg'></a><h3><a href='https://flickr.com/"+nsid+"/"+id+"' target='new'>"+title+"</a> by <a href=https://flickr.com/"+nsid+" target='new'>" +author+"</a></h3><h3>Description:"+description+"</h3><h3>Tags:"+list_tags+"</h3></td>")
});
 
        

    });
    $("#flickr_photos").append(list);
 });
    
});

};

function doSearch() {
// 1: clear results from web page
$("#flickr_photos").empty();
// 2: search for and load new image results
searchstring = document.getElementById("searchBox").value;
retrieve3rows();
};

function checkbottomofpage() {
  
  // if user scrolls to bottom of page
  // then more images are loaded and displayed

  if($(window).scrollTop() + $(window).height() == $(document).height() ) {

    retrieve3rows();
  };
};

function retrieve3rows(){
  // 3 rows ideal - just extends past 1 page - so it will autoload content when you scroll to bottom
    getPhotos(searchstring, currentPage);
    currentPage += 1;
    getPhotos(searchstring, currentPage);
    currentPage += 1;
    getPhotos(searchstring, currentPage);
    currentPage += 1;
  
}