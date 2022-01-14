import { LIST_CATEGORIES } from '../constants';

export default class FacebookUtil {
	// map facebook categories to my_categories
	static mapFacebookCategories(facebook_categories) {
		var my_categories = new Set(); // list not duplicate
		for (let i = 0; i < facebook_categories.length; i++) {
			if (
				[
					'Band',
					'Musician/band',
					'Jazz Band',
					'Marching Band',
					'Concert Tour',
					'Concert Tour Manager',
					'Orchestra',
					'Symphony',
					'Music video',
					'Musician',
					'Music Chart',
					'Music Production Studio',
					'Live Music Venue',
					'Movie & Music Store',
					'Song',
					'Songwriter',
					'Singer',
					'Karaoke',
				].includes(facebook_categories[i])
			) {
				my_categories.add(LIST_CATEGORIES.amnhac);
			} else if (
				[
					'Engineering Service',
					'Structural Engineer',
					'Sound Engineer',
					'Mastering Engineer',
					'Information Technology Company',
					'Scientist',
					'Science Website',
					'Computer Company',
					'Computers (Brand)',
					'Computer Repair Service',
					'Computer Store',
					'Computer Training School',
					'Internet company',
					'Hardware Store',
					'Software',
					'Software Company',
					'Phone/Tablet',
					'Mobile Phone Shop',
					'Telecommunication company',
					'Internet Service Provider',
				].includes(facebook_categories[i])
			) {
				my_categories.add(LIST_CATEGORIES.do_cong_nghe);
			} else if (
				[
					'Sports team',
					'Sports',
					'Sports league',
					'Sports Event',
					'Amateur Sports Team',
					'School Sports Team',
					'Professional Sports Team',
					'Stadium, Arena & Sports Venue',
					'Athlete',
					'Badminton Court',
					'Baseball Field',
					'Baseball Stadium',
					'Batting Cage',
					'Boxing Studio',
					'Sports Promoter',
					'Fitness Trainer',
					'Fitness Model',
					'Fitness Boot Camp',
					'Gym/Physical Fitness Center',
					'Sport & Fitness Instruction',
					'Gym/Physical Fitness Center',
					'Gymnastics Center',
					'Rock Climbing Gym',
					'Outdoor & Sporting Goods Company',
					'Outdoor Equipment Store',
					'Football Stadium',
					'Soccer Stadium',
					'Soccer Field',
					'Coach',
					'Personal Coach',
				].includes(facebook_categories[i])
			) {
				my_categories.add(LIST_CATEGORIES.thethao);
			} else if (
				[
					'Tour Agency',
					'Tour Guide',
					'Tourist Information Center',
					'Sightseeing Tour Agency',
					'Eco Tour Agency',
					'Food Tour Agency',
					'Travel Company',
					'Travel & Transportation',
					'Travel agency',
					'Travel Service',
					'Local & travel website',
					'Bags/Luggage',
					'Luggage Service',
					'Bags & Luggage Store',
					'Bags & Luggage Company',
					'Bay',
					'Beach',
					'Beach Resort',
					'Hotel resort',
					'Ski Resort',
					'Hotel',
					'Hotel & Lodging',
					'Landmark & Historical Place',
					'Photographer',
					'Photography Videography',
					'Picnic Ground',
					'Translator',
				].includes(facebook_categories[i])
			) {
				my_categories.add(LIST_CATEGORIES.dulich);
			} else if (
				[
					'Esports Team',
					'Esports League',
					'Games/toys',
					'Gamer',
					'Game Publisher',
					'Video Game',
					'Board Game',
					'Video Game Store',
					'Escape Game Room',
					'Recreation Center',
					'Bowling Alley',
					'Gameing video creator',
					'Casino',
					'Playground',
				].includes(facebook_categories[i])
			) {
				my_categories.add(LIST_CATEGORIES.game);
			} else if (
				[
					'Appliances',
					'Appliance Repair Service',
					'Appliance Manufacturer',
					'Plastic Manufacturer',
					'Automotive Manufacturer',
					'Motorcycle Manufacturer',
					'Mattess Manufacturer',
					'Household supplies',
					'House Painting',
					'House Sitter',
					'Home',
					'Home decor',
					'Home Improvement',
					'Home Mover',
					'Home & Garden Website',
					'Vacation Home Rental',
					'In-Home Service',
					'Mobile Home Dealer',
					'Residence',
					'Apartment & Condo Building',
					'Baby goods/kids goods',
					'Babysitter',
					'Child Care Service',
					'Child Protective Service',
					'Blinds & Curtain Store',
					'Home Window Service',
					'Awning Supplier',
					'Carpet & Flooring Store',
					'Carpet Cleaner',
					'Cleaning Service',
					'Janitorial Service',
					'Damage Restoration Service',
					'Family Medicine Pratice',
					'Family Doctor',
					'Family Therapist',
					'Divorce & Family Lawyer',
					'Garage Door Service',
					'Parking Garage / Lot',
					'Glass Service',
					'Glass & Mirror Shop',
					'Glass Blower',
					'Glass Manufacturer',
					'Automotive Glass Service',
					'Garden Center',
					'Home & Garden Website',
					'Home & Garden Store',
					'Inn',
					'Kitchen & Bath Contractor',
					'Landlord & Tenant Lawyer',
					'Lighting Store',
					'Lighthouse',
					'Maid & Butler',
					'Marriage Therapist',
					'Horse-Drawn Carriage Service',
					'Tiling Service',
				].includes(facebook_categories[i])
			) {
				my_categories.add(LIST_CATEGORIES.nhacua_doisong);
			} else if (
				[
					'Accessories',
					'Beauty Salon',
					'Beauty, cosmetic & personal care',
					'Beauty Store',
					'Beauty Supplier',
					'Beauty Supply Store',
					'Health/beauty',
					'Hair Salon',
					'Baber Shop',
					'Spa',
					'Health Spa',
					'Medical Spa',
					'Day Spa',
					'Hair Extensions Service',
					'Jewelry',
					'Jewelry/watches',
					'Jewelry & Watches Store',
					'Jewelry & Watches Company',
					'Jewelry Wholesaler',
					'Nail Salon',
					'Nail Artist',
					'Skin Care Service',
					'Waxing Service',
				].includes(facebook_categories[i])
			) {
				my_categories.add(LIST_CATEGORIES.sacdep_phukien);
			} else if (
				[
					'Book',
					'Book Series',
					'Bookstore',
					'Book & Magazine Distributor',
					'School',
					'Middle School',
					'Public School',
					'Private School',
					'Elementary School',
					'Academic Camp',
					'Arts & Humanities Website',
					'Author',
					'Writer',
					'Library',
					'Writing Service',
					'Education website',
					'Educational Consultant',
					'Educational Supply Store',
					'Educational Research Center',
					'Tutor/Teacher',
				].includes(facebook_categories[i])
			) {
				my_categories.add(LIST_CATEGORIES.sach_tapchi);
			} else if (
				[
					'Abortion Service',
					'Sex Therapist',
					'Sex Artist',
					'STD Testing Center',
				].includes(facebook_categories[i])
			) {
				my_categories.add(LIST_CATEGORIES.sinhly);
			} else if (
				[
					'Clothing (Brand)',
					'Clothing store',
					'Clothing Company',
					'Apparel & clothing',
					"Women's clothing store",
					"Men's clothing store",
					"Baby & childrend's clothing store",
					'Thrift & Consignment Store',
					'Apparel & Distributor',
					'Sportswear Store',
					'Bridal Shop',
					'Costume Shop',
					'Costume Designer',
					'Fashion Model',
					'Fashion Designer',
					'Fashion Stylist',
					'Design & fashion',
					'Fabric Store',
					'Footwear store',
					'Hat Store',
				].includes(facebook_categories[i])
			) {
				my_categories.add(LIST_CATEGORIES.thoitrang);
			} else if (
				[
					'Restaurant',
					'Restaurant Supply Store',
					'Restaurant Wholesaler',
					'Fast food restaurant',
					'Chinese Restaurant',
					'American Restaurant',
					'Vietnamese Restaurant',
					'Korea Restaurant',
					'Asian Restaurant',
					'Seafood Restaurant',
					'Burger Restaurant',
					'Japanese Restaurant',
					'Sushi Restaurant',
					'Ramen Restaurant',
					'Dim Sum Restaurant',
					'Health Food Restaurant',
					'Bagel Shop',
					'Bakery',
					'Wholesale Bakery',
					'Cafe',
					'Dessert Shop',
					'Cupcake Shop',
					'Chocolate Shop',
					'Donut Shop',
					'Food & beverage',
					'Foodservice distributor',
					'Food delivery service',
					'Food Wholesaler',
					'Food Stand',
					'Health Food',
					'Grocery Store',
					'Coffee shop',
					'Cafe',
					'Cafeteria',
					'Internet Cafe',
					'Pet Cafe',
					'Bar',
					'Bar & Grill',
					'Bartending Service',
					'Bartending School',
					'Wine Bar',
					'Beer Garden',
					'Beer Bar',
					'Bottled Water Supplier',
					'Bottled Water Company',
					'Breakfast & Brunch Restaurant',
					'Candy Store',
					'Caterer',
					'Cheese Shop',
					'Chicken Joint',
					'Cocktail Bar',
					'Gay Bar',
					'Cooking School',
					'Kitchen/cooking',
					'Cupkake Shop',
					'Diner',
					'Fruit & Vegetable Store',
					'Frozen Yogurt Shop',
					'Gelato Shop',
					'Ice Cream Shop',
					'Pub',
					'Chef',
					'Personal Chef',
					'Pizza place',
				].includes(facebook_categories[i])
			) {
				my_categories.add(LIST_CATEGORIES.thucpham_douong);
			}
		}

		// console.log(Array.from(my_categories));

		return Array.from(my_categories);
	}
}
