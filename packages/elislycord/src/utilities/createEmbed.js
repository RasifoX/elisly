module.exports = (() => {
  const result = {};
  const data = {"author": {}, "fields": [], "thumbnail": {}, "image": {}};

  result.addField = ((name, value, inline = false) => {
    const field = {};

    field.name = name.toString();
    field.value = value.toString();
    field.inline = inline;

    data.fields.push(field);

    return result;
  });

  result.setColor = ((color) => {
    data.color = color;

    return result;
  });

  result.setTimestamp = ((timestamp = Date.now) => {
    data.timestamp = timestamp;

    return result;
  });

  result.setAuthor = ((name, iconURL = null, url = null) => {
    data.author.name = name.toString();
    data.author.icon_url = iconURL !== null ? iconURL.toString() : null;
    data.author.url = url !== null ? url.toString() : null;

    return result;
  });

  result.setDescription = ((description) => {
    data.description = description.toString();

    return result;
  });

  result.setTitle = ((title) => {
    data.title = title.toString();

    return result;
  });

  result.setThumbnail = ((url) => {
    data.thumbnail.url = url !== null ? url.toString() : null;

    return result;
  });

  result.setImage = ((url) => {
    data.image.url = url !== null ? url.toString() : null;

    return result;
  });

  /*
    result[Symbol.for("nodejs.util.inspect.custom")] = (() => {
      return data;
    });
  */

  result.toJSON = (() => {
    return data;
  });

  return result;
});
