module PostMore
  def postmorefilter(input, url, text)
    if input.include? "<!--more-->"
      input.split("<!--more-->").first + "<p><a class='btn btn-primary btn-large' href='#{url}'>#{text} &rarr;</a></p>"
    else
      if input.include? "<h2 id='comments'>"
        input.split("<h2 id='comments'>").first + "<p><a class='btn btn-primary btn-large' href='#{url}'>#{text} &rarr;</a></p>"
      else
        input
      end
    end
  end
end

Liquid::Template.register_filter(PostMore)