# Real-Time Vocabulary Quiz Coding Challenge

Welcome to my mini-project for the coding challenge ✨ \
Please, be my guest and have a cup of tea 🍵 with a delicious cake(s) 🍪 of your choice before diving into the following project information

# 1. System Design
## 🔑 System Architecture

🌟 The system design adopts a **microservices architecture** to ensure modularity, scalability, and fault tolerance. \
🌟 Additionally, the system leverages a **headless architecture** to enhance flexibility and integration capabilities.

####  💡 Key Benefits of Microservices Architecture
- Independent Deployment: Each service can be deployed without affecting others
- Fault Isolation: Failures in one service do not cascade to the entire system
- Scalability: Services can scale independently based on traffic patterns
- Service Communication: \
        - Synchronous communication (e.g., RESTful API) for critical requests \
        - Asynchronous communication (e.g., message queues) for non-blocking operations
- Agility: Accelerates development and deployment cycles by enabling teams to work on services independently
- Flexibility: Supports the use of different databases, programming languages, or frameworks for specific services

&nbsp;
&nbsp;

![System Architecture Diagram](<docs/quiz-system-architecture.png>)
<div style="text-align: center;">System Architecture Diagram</div>

## 🔑 System Components
### 1. Client Application
- Allows users to join quizzes, answer questions, and view leaderboards
- Communicates with other services RESTful APIs
- Provides a decoupled front-end that interacts with backend services exclusively through APIs
- Omni-Channel Support: Enables content delivery across multiple platforms (e.g., mobile apps, web apps, third-party systems)

### 2. API Gateway
- Routes requests to appropriate services
- Enhanced Security: Enforces authentication, authorization, and input validation at the gateway level
- Rate Limiting and Throttling: Prevents misuse by controlling the rate of incoming requests per client
- Request/response transformation
- Load Distribution: Works with the load balancer to distribute requests efficiently to backend services
- Monitoring and Analytics: Collects metrics and logs API usage patterns, aiding performance optimization

### 3. Load Balancer
- Distributes traffic across multiple server instances efficiently, improve performance
- High Availability: Automatically reroutes traffic to healthy server instances if one or more instances fail, ensuring the system remains operational
- Improve fault tolerance and scalability: Facilitates horizontal scaling by seamlessly adding or removing servers based on traffic load

### 4. Databases
- Quiz DB: Store quiz content (questions, answer options) and results (valid answers)
- User DB: Store users data (Basic information: name, email, phone, etc.. and quiz attendance results)

### 5. In-memory Data Store
- Data caching layer for quizzes (content, results) and basic user information to reduce load on the databases, improving overall system performance
- Data store for real-time score aggregation, leaderboard calculations by using sorted sets for efficient ranking
- Providing sub-millisecond response times for real-time leaderboard updates
- Scalability: It supports high-throughput operations and ensures the system can handle spikes in user activity

### 6. Queue System
- Asynchronously process answer submissions and quiz attendance results history
- Decouple real-time updates (producer) from backend processing (consumers), enabling each of it to scale independently, optimize performance and scalability
- Controls the flow of tasks to downstream services, ensuring they are not overwhelmed
- Increase system resilience \
        - Fault isolation: If one component crashes, the queue holds pending tasks until the service recovers, preventing a complete system failure \
        - Message Persistence: Messages can be stored persistently, allowing recovery from unexpected failures
- Enhance Reliability \
        - Guaranteed Message Delivery: Queues ensure that submitted answers are not lost, even if the downstream service is temporarily unavailable \
        - Retry Mechanism: Failed tasks can be retried automatically, ensuring critical operations are eventually processed

### 7. Quiz Service
- Quiz content retrieval
- Manages quiz sessions
- Validates answers
- Calculates scores
- CRUD operations to manage quiz content

### 8. Real-time Service
- Maintains real-time connections
- Broadcasts score updates
- Handles user presence
- Manages quiz state changes

### 9. User service
- User authentication
- User profile management
- User quiz attendance results history
- Session management

## 🔑 Data flows

## 🔑 Technologies and Tools

# 2. Implementation

# 🎇 Final Thought
### Thanks for coming along down here with your patient and curiosity 🙋
### Have a good time and enjoy the project exploring 🤘