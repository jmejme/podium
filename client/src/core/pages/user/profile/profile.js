import React from 'react';
import ImmutableComponent from '../../../widgets/immutableComponent';

import { Map, List, fromJS } from 'immutable';

import ProfilePage from './profilepage';
import ProfileCard from './profilecard';
import ProfileTooltip from './profileinset';
import ProfileTab from './profiletab';


const emptyState = {
	user: null,
	valid: true,
	profile: null,
	posts: null,
	followers: null,
	following: null,
	loading: {
		profile: false,
		posts: false,
		followers: false,
		following: false
	}
}



class Profile extends ImmutableComponent {

	constructor() {
		super(emptyState)
		this.setUser = this.setUser.bind(this)
	}


	immutableWillMount() {
		this.loadUser()
	}


	componentDidUpdate(lastProps) {
		if (lastProps.target !== this.props.target) {
			this.updateState(state => state.merge(fromJS(emptyState)))
			this.loadUser()
		}
	}


	loadUser() {
		if (this.props.from === "id") {
			this.loadUserFromID(this.props.target)
		} else if (this.props.from === "address") {
			this.loadUserFromAddress(this.props.target)
		} else {
			this.setUser(this.props.target)
		}
	}


	loadUserFromID(id) {
		this.props.podium
			.isUser(id)
			.then(address => {
				if (address) {
					this.loadUserFromAddress(address)
				} else {
					this.updateState(state => state.set("valid", false))
				}
			})
			.catch(error => {
				console.error(error)
				this.updateState(state => state.set("valid", false))
			})

	}


	loadUserFromAddress(address) {
		this.props
			.getUser(address, false)
			.then(this.setUser)
			.catch(error => {
				console.error(error)
				this.updateState(state => state.set("valid", false))
			})
	}



	setUser(user) {

		this.updateState(state => state
			.set("user", user)
			.set("loading", Map({
				profile: true,
				posts: true,
				followers: true,
				following: true
			}))
		)

		// Load profile data
		user.profile()
			.then(profile => this.updateState(state => state
				.set("profile", profile)
				.setIn(["loading", "profile"], false)
			))
			.catch(error => console.error(error))

		
		if (this.props.format !== "tab") {

			// Load user's posts
			user.postIndex()
				.then(index => Promise.all(
					index.map(a => this.props.getPost(a, false))
				))
				.then(posts => this.updateState(state => state
					.set("posts", List(posts))
					.setIn(["loading", "posts"], false)
				))
				.catch(error => console.error(error))

			// Load this user's followers
			user.followerIndex()
				.then(index => Promise.all(
					index.map(a => this.props.getUser(a, false))
				))
				.then(followers => this.updateState(state => state
					.set("followers", List(followers))
					.setIn(["loading", "followers"], false)
				))
				.catch(error => console.error(error))

			// Load user's followed by this user
			user.followingIndex()
				.then(index => Promise.all(
					index.map(a => this.props.getUser(a, false))
				))
				.then(following => this.updateState(state => state
					.set("following", List(following))
					.setIn(["loading", "following"], false)
				))
				.catch(error => console.error(error))

		}

	}



	render() {

		let ProfileFormat;
		switch (this.props.format) {

			// Render as a card
			case("card"):
				ProfileFormat = ProfileCard
				break;

			// Render as an inset
			case("inset"):
				ProfileFormat = ProfileTooltip
				break;

			case("tab"):
				ProfileFormat = ProfileTab
				break;

			// Render as full page by default
			default:
				ProfileFormat = ProfilePage

		}

		return <ProfileFormat

			podium={this.props.podium}
			activeUser={this.props.activeUser}

			side={this.props.side}

			valid={this.getState("valid")}

			user={this.getState("user")}
			profile={this.getState("profile")}
			posts={this.getState("posts")}
			followers={this.getState("followers")}
			following={this.getState("following")}

			reload={this.loadUser}

			getUser={this.props.getUser}
			getPost={this.props.getPost}

		/>

	}

}

export default Profile;
