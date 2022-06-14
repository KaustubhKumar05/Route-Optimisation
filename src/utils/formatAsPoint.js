const formatAsPoint = (lngLat) => {
  return {
    point: {
      latitude: lngLat.lat,
      longitude: lngLat.lng
    }
  };
};

export default formatAsPoint;
