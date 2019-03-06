import React from 'react';
import { Link } from 'react-router-dom';
import ImmutableComponent from '../../components/immutableComponent';

import FollowButton from '../../components/buttons/followButton';

import MiniLoader from '../../components/miniLoader';



class ProfileTab extends ImmutableComponent {

	render() {
		return !this.props.user ?
			null :
			<div
				className={this.props.profile ?
					"card profiletab profiletab-loaded" :
					"card profiletab"
				}
				onClick={() => { if (this.profileLink) {
					this.props.transition(() => this.profileLink.click())
				}}}>
				{this.props.profile ?
					<Link
						to={`/user/${this.props.profile.id}`}
						innerRef={ref => this.profileLink = ref}
						style={{ display: "none" }}
					/>
					: null
				}

				<div className="profiletab-buttons">
					<div className="profiletab-button">
						<FollowButton

							activeUser={this.props.activeUser}
							targetUser={this.props.user}

							followUser={this.props.followUser}
							unfollowUser={this.props.unfollowUser}

							captionLocation="left"
							captionOffset={0.2}
							size={1.4}
							
						/>
					</div>
				</div>

				<div className="profiletab-picture-holder">
					{this.props.profile ?
						<img
							className="profiletab-picture"
							src={this.props.profile.get("pictureURL")}
							alt=""
						/>
						:
						<div className="profiletab-picture-loading-box">
							<MiniLoader size={1.2} color="white" />
						</div>
					}
				</div>

				{this.props.profile ?
					<div className="profiletab-name">
						<p className="profiletab-name-text">
							{this.props.profile.get("name")}
						</p>
					</div>
					: null
				}

				{this.props.profile ?
					<div className="profiletab-id">
						<p className="profiletab-id-text">
							@{this.props.profile.get("id")}
						</p>
					</div>
					: null
				}

			</div>
	}

}

export default ProfileTab;