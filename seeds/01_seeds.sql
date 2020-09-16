INSERT INTO users (name, email, password) 
VALUES ('Ima Pancake', 'zooby@ooby.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Yuri Burrito', 'zilly@ooby.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Issa Taco', 'taccyy@ooby.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties (
  owner_id, 
  title, 
  thumbnail_photo_url,
  cover_photo_url,
  cost_per_night,
  parking_spaces,
  number_of_bathrooms,
  number_of_bedrooms,
  country,
  street,
  city,
  province,
  post_code,
  active) 
VALUES (1, 'BeetFarm', 'https://www.pexels.com/photo/white-and-brown-concrete-building-5156010/', 'https://www.pexels.com/photo/white-and-brown-concrete-building-5156010/',
100, 2, 1, 4, 'Canada', 'Ocean Ave', 'Lyon', 'AB', '45f24e', TRUE),
(3, 'CarrotCatFarm', 'https://www.pexels.com/photo/white-and-brown-concrete-building-5156010/', 'https://www.pexels.com/photo/white-and-brown-concrete-building-5156010/',
180, 4, 4, 2, 'Canada', 'Mewo street', 'FIBBY', 'AB', '45624e', TRUE),
(2, 'Econolodge', 'https://www.pexels.com/photo/white-and-brown-concrete-building-5156010/', 'https://www.pexels.com/photo/white-and-brown-concrete-building-5156010/',
10, 0, 1, 1, 'Canada', 'Silky Ave', 'Keevy', 'AB', '77f24e', TRUE);


INSERT INTO reservations (start_date, end_date, property_id, guest_id) 
VALUES ('2018-09-11', '2018-09-26', 1, 1),
('2019-01-04', '2019-02-01', 2, 2),
('2021-10-01', '2021-10-14', 3, 3);


INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message) 
VALUES (3, 3, 1, 5, 'super-duper'),
(2, 2, 3, 4, 'Ehhh'),
(2, 1, 2, 2, 'wompwmpmwompppp');