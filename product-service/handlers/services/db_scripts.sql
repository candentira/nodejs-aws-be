--create table products (
--	id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
--	title text not NULL,
--	description text,
--	price integer
--)

--create extension if not exists "uuid-ossp";

--create table stocks (
--	product_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
--	count integer
--)

--drop table stocks;

--insert into products (title, description, price) values
--('ProductFirst', 'Short Product Description1', 2),
--('ProductNew', 'Short Product Description3', 10),
--('ProductTop', 'Short Product Description2', 23),
--('ProductTitle', 'Short Product Description7', 15),
--('Product', 'Short Product Description2', 23),
--('ProductTest', 'Short Product Description4', 15),
--('Product2', 'Short Product Descriptio1', 23),
--('ProductLast', 'Short Product Description7', 15);

--insert into stocks (product_id, count) values
--('91f5115c-eed1-4374-9745-2b8ca50d2fff', 4),
--('64f580f1-bc1f-4d9a-a9a5-999347f2d974', 6),
--('8520575e-4c51-45f4-9cb8-3cbed149b918', 7),
--('ce62fd58-6029-400c-bb7e-28bc580fb0fc', 12),
--('37e1349e-df9b-444e-90bd-b2ded72d0b4d', 7),
--('bdf33012-8aa4-4779-ad18-2156898a12de', 8),
--('977db3fa-0a2a-49ed-af57-8d1a3b82e28a', 2),
--('91f93437-7036-4253-a0f0-7300ca95ec76', 3);
