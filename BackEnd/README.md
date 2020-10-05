# GamerBase-backend

GamerBase is a Full-Stack app built for the Jan 2020 CUNY2X bootcamp. This repository serves as the backend for the app
and was built with PostgresSQL and Node.js.

## Running

Use the package manager npm to install all prerequisite packages and start.

```bash
npm install
npm start
```

## Frontend repository

The frontend repository for the webapp can be found at
[https://github.com/jordan722/GamerBase](https://github.com/jordan722/GamerBase)

# Link to Deployed Web-App

[This web app was deployed using heroku, and can be accessed here!](http://gamerbase.herokuapp.com/)

## APIs used

The backend makes use of calling the Twitch, Youtube, Mixer and rawg APIs. For more information about the APIs, their
documentation can be found here:
- [https://dev.twitch.tv/docs/api](https://dev.twitch.tv/docs/api)
- [https://developers.google.com/youtube/v3/getting-started](https://developers.google.com/youtube/v3/getting-started)
- [https://dev.mixer.com/guides/core/introduction](https://dev.mixer.com/guides/core/introduction)
- [https://api.rawg.io/docs/](https://api.rawg.io/docs/)

## Use

Running the backend will create a database for users and posts. Make sure that postgreSQL or another database installed
and set-up before using npm start. PostgreSQL can be found at https://www.postgresql.org/

## Endpoints

<table>
	<tr>
    <td><strong>Method</strong></td>
		<td><strong>Path</strong></td>
		<td><strong>Params</strong></td>
		<td><strong>Body</strong></td>
		<td><strong>Returns</strong></td>
		<td><strong>Usage</strong></td>
	</tr>
	<tr>
		<td>POST</td>
		<td>/api/auth/signup</td>
		<td></td>
		<td>
			<ul>
				<li>name (string)</li>
				<li>email (string)</li>
				<li>password (string)</li>
			</ul>
		</td>
		<td>
			<ul>
				<li>user (object)</li>
			</ul>
		</td>
		<td>Creates a user</td>
	</tr>
	<tr>
		<td>POST</td>
		<td>/api/auth/login</td>
		<td></td>
		<td>
			<ul>
				<li>email (string)</li>
				<li>password (string)</li>
			</ul>
		</td>
		<td>
			<ul>
				<li>user (object)</li>
			</ul>
		</td>
		<td>Logs a user in and assigns user a session cookie</td>
	</tr>
	<tr>
		<td>DELETE</td>
		<td>/api/auth/logout</td>
		<td></td>
		<td></td>
		<td></td>
		<td>Logs a user out and deletes their session cookie</td>
	</tr>
	<tr>
		<td>GET</td>
		<td>/api/users/</td>
		<td></td>
		<td></td>
		<td>
			<ul>
				<li>users (array)</li>
			</ul>
		</td>
		<td>Get a list of all users</td>
	</tr>
	<tr>
		<td>GET</td>
		<td>/api/users/:id</td>
		<td>
			<ul>
				<li>id (user id)</li>
			</ul>
		</td>
		<td></td>
		<td>
			<ul>
				<li>user (object)</li>
			</ul>
		</td>
		<td>Get a user by their id</td>
	</tr>
	<tr>
		<td>GET</td>
		<td>/api/rawg/trending</td>
		<td></td>
		<td></td>
		<td>
			<ul>
				<li>games (array)</li>
			</ul>
		</td>
		<td>Gets trending games on RAWG</td>
	</tr>
	<tr>
		<td>GET</td>
		<td>/api/rawg/topRated</td>
		<td></td>
		<td></td>
		<td>
			<ul>
				<li>games (array)</li>
			</ul>
		</td>
		<td>Gets top rated games on RAWG</td>
	</tr>
	<tr>
		<td>GET</td>
		<td>/api/rawg/upcoming</td>
		<td></td>
		<td></td>
		<td>
			<ul>
				<li>games (array)</li>
			</ul>
		</td>
		<td>Gets upcoming games on RAWG</td>
	</tr>
	<tr>
		<td>GET</td>
		<td>/api/rawg/:id</td>
		<td>
			<ul>
				<li>id (RAWG game id)</li>
			</ul>
		</td>
		<td></td>
		<td>
			<ul>
				<li>game (object)</li>
			</ul>
		</td>
		<td></td>
	</tr>
	<tr>
		<td>GET</td>
		<td>/api/rawg/:id/reddit</td>
		<td>
			<ul>
				<li>id (RAWG game id)</li>
			</ul>
		</td>
		<td></td>
		<td>
			<ul>
				<li>reddit_posts (object)</li>
			</ul>
		</td>
		<td>Gets info about game's subreddit including top posts</td>
	</tr>
	<tr>
		<td>GET</td>
		<td>/api/rawg/:id/youtube</td>
		<td>
			<ul>
				<li>id (RAWG game id)</li>
			</ul>
		</td>
		<td></td>
		<td>
			<ul>
				<li>youtube (object)</li>
			</ul>
		</td>
		<td>Gets info about game's top viewed youtube videos</td>
	</tr>
	<tr>
		<td>GET</td>
		<td>/api/twitch/streams?gameName</td>
		<td>
			<ul>
				<li>gameName (name of game to search for)</li>
			</ul>
		</td>
		<td></td>
		<td>
			<ul>
				<li>stream_info (object)</li>
			</ul>
		</td>
		<td>Gets information about game and top live streams on Twitch</td>
	</tr>
	<tr>
		<td>GET</td>
		<td>/api/mixer/streams?gameName</td>
		<td>
			<ul>
				<li>gameName (name of game to search for)</li>
			</ul>
		</td>
		<td></td>
		<td>
			<ul>
				<li>stream_info (object)</li>
			</ul>
		</td>
		<td>Gets information about game and top live streams on Mixer</td>
	</tr>
	<tr>
		<td>GET</td>
		<td>/api/youtube/streams?gameName</td>
		<td>
			<ul>
				<li>gameName (name of game to search for)</li>
			</ul>
		</td>
		<td></td>
		<td>
			<ul>
				<li>stream_info (object)</li>
			</ul>
		</td>
		<td>Gets information about game and top live streams on Youtube</td>
	</tr>
	<tr>
		<td>GET</td>
		<td>/api/posts/</td>
		<td></td>
		<td></td>
		<td>
			<ul>
				<li>posts (object)</li>
			</ul>
		</td>
		<td>Gets a list of all posts</td>
	</tr>
	<tr>
		<td>POST</td>
		<td>/api/posts/</td>
		<td></td>
		<td>
			<ul>
				<li>title (string)</li>
				<li>lastUpdated (date)</li>
				<li>userId (number) - owner user id</li>
			</ul>
		</td>
		<td>
			<ul>
				<li>post (object)</li>
			</ul>
		</td>
		<td>Creates a post</td>
	</tr>
	<tr>
		<td>GET</td>
		<td>/api/posts/:id</td>
		<td>
			<ul>
				<li>id (post/thread id)</li>
			</ul>
		</td>
		<td></td>
		<td>
			<ul>
				<li>post (object)</li>
			</ul>
		</td>
		<td>Gets a post by its id</td>
	</tr>
	<tr>
		<td>PUT</td>
		<td>/api/posts/:id</td>
		<td>
			<ul>
				<li>id (post/thread id)</li>
			</ul>
		</td>
		<td>
			<ul>
				<li>title (string)</li>
				<li>lastUpdated (date)</li>
				<li>replies (array of replies)</li>
			</ul>
		</td>
		<td>
			<ul>
				<li>post (object)</li>
			</ul>
		</td>
		<td>Updates a post by its id</td>
	</tr>
</table>
