module.exports = function(db) {
	
	async function findUser(username) {
		return await db.oneOrNone('select * from fruit_eater where username = $1', [username])
	}

	async function createUser(username, password){
		await db.none(`insert into fruit_eater (username, password) values ($1, $2)`, [username, password]);
	}

	async function getUserCounters(username) {
		const sql = `select fruit_eaten.* from fruit_eaten join fruit_eater 
						on fruit_eaten.user_id = fruit_eater.id where username = $1 
						order by fruit_eaten.id asc`
		const counters = await db.manyOrNone(sql, [username]);
		return counters;
	}

	async function createCountersForUser(username) {
		const {id} = await findUser(username);
		const fruits = ['apple', 'pear', 'banana'];
		const sql = `insert into fruit_eaten (user_id, fruit_name, counter) values ($1, $2, 0)`
		await Promise.all(fruits.map(fruit => db.none(sql, [id, fruit])));
	}

	async function eatFruit(username, fruit) {
		
		const {id} = await findUser(username);
		const sql = `update fruit_eaten set counter = counter + 1 where fruit_name = $1 and user_id = $2`
		await db.none(sql, [fruit, id]);

	}

	return {
		createUser,
		eatFruit,
		findUser,
		getUserCounters,
		createCountersForUser
	}

}