# Operations and Management

## Software 

All CEDAR software is stored in GitHub repositories. We created a
GitHub organization called [metadatacenter](https://github.metadatacenter.org) to manage access to
the software. Since all CEDAR software is open source, we provide
read access to all GitHub users.

We make all our software freely and publicly available under the
2-Clause BSD open-source license, which allows the dissemination
and commercialization of derivative products by everyone. We have
used this license in our CEDAR, Protégé, and NCBO projects. The
[CEDAR Web site](https://metadatacenter.org) facilitates browsing
and downloading of all tools and knowledge resources in the
project.

## Issue Tracking

CEDAR uses a [GitHub-based project issue tracking
board](https://github.com/orgs/metadatacenter/projects/7/views/2)
to track features and bug fixes. This board is integrated with
GitHub so feature requests and bug reports made by GitHub users
can be automatically tracked. We also have a dedicated [mailing list](https://metadatacenter.org/help/#subscribe). 

## Monitoring

We continuously monitor system uptime using the third-party
[StatusCake system](https://uptime.statuscake.com/?TestID=rrcYEek524). Any
outages are immediately routed to core developers via email and
Slack channels. Since its release in 2017, the system has had
only a dozen hours or so per year of outages.

## Development

The CEDAR software team adopts an agile software development
methodology with frequent releases that focus on adding new
system features. 

The software development team uses the [Git Flow branching
model](https://nvie.com/posts/a-successful-git-branching-model/)
to control the addition of features to each release. Minor
releases are usually made approximately every month, with major
releases every year or so. The first major 1.0.0 release was made
in February 2017. Releases are tagged using standard Git-based
version tagging and all releases are publicly available on
GitHub. We generate a comprehensive [release documentation](https://github.com/metadatacenter/cedar-project/releases) on each
numbered
release that identifies the new features provided in the release in
addition to any bug fixes. We also produce a [Web-based newsletter](https://metadatacenter.org/category/happenings/news/)
that describes the features contained in major
releases.

We use standard test-driven strategies for developing our
REST-based services and also have developed an array of tests for
CEDAR’s front end components. All CEDAR components have a set of
tests that are executed automatically using the
[Travis](https://www.travis-ci.com/) continuous integration
system. All developers are immediately notified via Slack when
tests fail so that issues can be quickly addressed.

## Backup Schedule

All CEDAR servers that contain persistent data are backed up
nightly. The servers that host CEDAR’s main production and
staging services are also backed up nightly, with incremental
backups every hour.

## Incident Management

We define incidents as problems in production. Incidents may or may not be customer facing.  Incidents are categorized as:

* _Blocker_ Major failure for a user or failure that affects the entire system or multiple modules of the system. This failure prevents a person from using the system.
* _Critical_ Major functionality is impaired in one or more common scenarios. A temporary workaround is available.
* _Minor_ A core function or feature is failing in rare or difficult-to-reproduce scenarios for a user.

Incidents may be caught through automated monitoring and
alerting (e.g., StatusCake, Slack) or manually (user-reported,
reported by developers or UI teams).

We aim to address blocker incidents immediately and, ideally, to
fix them within minutes. Critical issues are also addressed
immediately with the goal of fixing the underlying issue within
24 hours. For minor issues we create a GitHub issue and decide if
it is serious enough to be incorporated into the next sprint or
it can wait for subsequent sprints.

## Access and Security

New developers added to the CEDAR codebase complete an internal
onboarding process that includes access to various internal
groups.  Highly granular repository-level modification access is
provided through standard GitHub access control
mechanisms. Security related onboarding includes completion of
the following:

* HIPAA and Health Information Security training
* Application Security Training

CEDAR servers are deployed using an in-house server hosting
infrastructure. Access to deployment machines is governed by
Stanford security and access control mechanisms. Access is
mediated through each user’s Stanford SUNetID account
credentials.

In addition to this, Stanford hires are required to complete a
background check. Once these procedures have been completed,
developers are then considered suitable for code deployment and
on-call operations.

