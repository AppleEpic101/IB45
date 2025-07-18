<script>
  let teamMembers = [
    {
      name: "Miles Xing",
      title: "President",
      photo: "/placeholder.png",
      linkedin: "https://www.linkedin.com/in/miles-xing-9692a330b/"
    },
    {
      name: "Alex Du",
      title: "Co-founder, Co-owner",
      photo: "/placeholder.png",
      linkedin: "https://www.linkedin.com/in/miles-xing-9692a330b/"
    },
    {
      name: "Winston Thov",
      title: "Co-founder, Co-owner",
      photo: "/placeholder.png",
      linkedin: "https://www.linkedin.com/in/winston-thov-2209a120b/"
    },
    {
      name: "Daksh Gupta",
      title: "Marketing Manager",
      photo: "/placeholder.png",
      linkedin: "https://www.linkedin.com/in/miles-xing-9692a330b/"
    },
    {
      name: "William Yoon",
      title: "Marketing Manager",
      photo: "/placeholder.png",
      linkedin: "https://www.linkedin.com/in/miles-xing-9692a330b/"
    }
    // Add more team members here as needed
  ];
</script>

<style>
  .team-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    padding: 2rem;
    max-width: 1200px;
    margin: auto;
  }
  .member-card {
    background: transparent;
    padding: 1rem;
    border-radius: 0;
    box-shadow: none;
    text-align: center;
  }
  .member-photo {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 50%;
    margin-bottom: 1rem;
  }
  .member-name {
    font-size: 1.2rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }
  .member-title {
    font-size: 0.95rem;
    color: #555;
  }
  h1 {
    text-align: center;
    padding: 1.5rem 0;
  }
  p {
    margin-left:10%;
    margin-right:10%;
    line-height: 2;
  }
  img {
    size-adjust: 120%;
  }
</style>
<h1>About Us</h1>
<p>
Founded in June 2023 as a CAS project by a group of first-year IB students at Interlake High School, IB Predict™ was created with one goal: to support teachers, coordinators, and candidates in navigating the IB Diploma Program. Since its launch, 650,000+ people from over 150+ countries worldwide have visited the platform. IB Predict™ uses real grade boundary data from past IB examination cycles to deliver clear and precise predictions, ensuring that predicted grades are fair and serve a reliable basis for university admissions. With IB Predict™, you'll know exactly what is needed in order to score a 4, 5, 6, or 7. No more, no less.
</p>
<h1>Meet Our Team</h1>
<div class="team-container">
  {#each teamMembers as member}
    <div class="member-card">
      <img src={member.photo} alt={`Photo of ${member.name}`} class="member-photo" />
      <div class="member-name">{member.name}</div>
      <div class="member-title">{member.title}</div>
      <a href={member.linkedin} target="_blank"><img src="/linkedin.png" padding=10px width=30px length=30px alt="" /></a>
    </div>
  {/each}
</div>
