const expect = require('chai').expect,
	request = require('supertest'),
	{ endsWith, last } = require('lodash'),
	valid_username = '123456789',
	valid_password = 'hello world!',
	valid_email = 'sample.person@gmail.com'

// don't worry about shutting down the server or cleaning up database before,
// since the former is handled by --exit and the latter by Makefile.
describe('app', () => {
	let agent

	before(async () => (agent = request.agent(await require('../app'))))

	/*---------- helpers ----------*/
	const shouldLoad = url => it(`should load ${url}`, () => agent.get(url).expect(200)),
		shouldRedirectTo = (res, url) =>
			expect(endsWith(last(res.redirects), url)).to.be.true,
		shouldReject = (url, body) =>
			agent
				.post(url)
				.send(body)
				.expect({}),
		shouldRedirectOnGet = (src, dest) =>
			it(`should redirect from ${src} to ${dest}`, () =>
				agent
					.get(src)
					.redirects(1)
					.then(res => shouldRedirectTo(res, dest))),
		shouldRedirectOnPost = (src, dest, bodies) =>
			it(`should redirect from ${src} to ${dest}`, () => {
				for (const body in bodies)
					agent
						.post(src)
						.send(body)
						.redirects(1)
						.then(res => shouldRedirectTo(res, dest))
			}),
		shouldValidateParams = (url, bodies) =>
			context('when the params are incorrect', () => {
				context('when body is empty', () =>
					it('should reject them', () => shouldReject(url, null))
				)

				context('when missing parameters', () =>
					it('should reject them', () =>
						shouldReject(url, { username: 'username' }))
				)

				context('when sending invalid parameters', () =>
					it('should reject them', () => {
						for (const body in bodies) shouldReject(url, body)
					})
				)
			}),
		shouldLogin = (src, dest, body) => {
			it(`should redirect to ${dest}`, () => {
				// TODO:
			})

			it('should authenticate the user', () => {
				// TODO:
			})
		},
		shouldRejectLogin = (src, dest, body) => {
			it(`should redirect to ${dest}`, () => {
				// TODO:
			})

			it('should show the error', () => {
				// TODO:
			})
		}

	/*---------- routes ----------*/
	context('when not signed in', () => {
		beforeEach(() => {
			// TODO: logoff
		})

		shouldRedirectOnGet('/', '/login')

		shouldLoad('/register')

		context('when POSTing to /register', () => {
			shouldValidateParams('/register', [
				{},
				{ username: valid_username },
				{
					username: valid_username,
					password: 123456789,
					email: valid_email
				},
				{
					username: false,
					password: valid_password,
					email: valid_email
				},
				{
					username: valid_username,
					password: valid_password,
					email: null
				},
				{
					username: valid_username,
					password: valid_password,
					email: valid_email,
					foo: 'bar'
				}
			])

			// TODO:
			context.skip('when the params are correct', () => {
				context('when no one exists with the same credentials', () =>
					shouldLogin('/register', '/', {})
				)

				context('when there exists a user with the same credentials', () =>
					shouldRejectLogin('/register', '/register', {})
				)
			})
		})

		shouldLoad('/login')

		context('when POSTing to /login', () => {
			shouldValidateParams('/login', [
				{ username: valid_username, password: undefined },
				{ username: true, password: valid_password }
			])

			// TODO:
			context.skip('when the params are correct', () => {
				context('when the credentials match', () =>
					shouldLogin('/login', '/', {})
				)

				context('when the credentials do not match', () =>
					shouldRejectLogin('/login', '/register', {})
				)
			})
		})

		shouldRedirectOnGet('/logout', '/')
	})

	context.skip('when signed in', () => {
		beforeEach(() => {
			// TODO: login
		})

		shouldLoad('/')

		shouldRedirectOnGet('/register', '/')

		shouldRedirectOnPost('/register', '/', [
			{},
			{ username: valid_username },
			{ username: undefined, password: valid_password },
			{ username: null, password: valid_password },
			{ username: valid_username, password: false },
			{ username: 123456789, password: valid_password },
			{ username: valid_username, password: valid_password }
		])

		shouldRedirectOnGet('/login', '/')

		// TODO: how to reuse sample sets?
		shouldRedirectOnPost('/login', '/', [])

		context('when GETting /logout', () => {
			it('should redirect from /logout to /')
			it('should log out the user')
		})
	})

	context('when requesting nonexisting page', () =>
		it('should return 404', () => agent.get('/bad_url').expect(404))
	)
})
